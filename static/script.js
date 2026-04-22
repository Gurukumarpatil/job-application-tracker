let allApplications = [];
let editingAppId = null;
let statusChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    loadApplications();
    loadAnalytics();

    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    function filterApplications() {
        const searchTerm = searchInput.value.toLowerCase();
        const status = statusFilter.value;

        const filteredApps = allApplications.filter(app => {
            const matchesSearch = app.company_name.toLowerCase().includes(searchTerm);
            const matchesStatus = status === "All" || app.status === status;
            return matchesSearch && matchesStatus;
        });

        renderTable(filteredApps);
        renderBoard(filteredApps);
    }

    searchInput.addEventListener('input', filterApplications);
    statusFilter.addEventListener('change', filterApplications);
});

function loadApplications() {
    fetch("/applications")
        .then(res => res.json())
        .then(data => {
            allApplications = data;
            renderTable(allApplications);
            renderBoard(allApplications);
        })
        .catch(err => console.error('Error loading applications:', err));
}

function loadAnalytics() {
    fetch("/analytics")
        .then(res => res.json())
        .then(data => {
            if(data.error) return;
            
            document.getElementById('totalAppsKpi').innerText = data.total;
            
            let offers = 0;
            let interviews = 0;
            const labels = [];
            const chartData = [];
            const bgColors = {
                'Applied': '#0ea5e9',
                'Interview': '#f59e0b',
                'Rejected': '#ef4444',
                'Offer': '#22c55e'
            };
            const bgMapped = [];

            data.stats.forEach(s => {
                labels.push(s.status);
                chartData.push(s.count);
                bgMapped.push(bgColors[s.status] || '#94a3b8');

                if(s.status === 'Offer') offers = s.count;
                if(s.status === 'Interview') interviews = s.count;
            });

            document.getElementById('offersKpi').innerText = offers;
            
            let rate = data.total > 0 ? Math.round(((interviews + offers) / data.total) * 100) : 0;
            document.getElementById('interviewRateKpi').innerText = rate + "%";

            renderChart(labels, chartData, bgMapped);
        })
        .catch(err => console.error('Error loading analytics:', err));
}

function renderChart(labels, data, bgColors) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    if(statusChartInstance) {
        statusChartInstance.destroy();
    }
    statusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: bgColors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });
}

function renderTable(data) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; color:var(--text-muted); padding: 2rem;">
                    No applications found.
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(app => {
        const statusClass = app.status.toLowerCase();
        const row = `
            <tr>
                <td>
                    <strong>${app.company_name}</strong>
                    ${app.job_url ? `<br><a href="${app.job_url}" target="_blank" style="font-size:0.8rem; color:var(--primary);">🔗 Link</a>` : ''}
                </td>
                <td>${app.role}</td>
                <td>${app.location || '-'}</td>
                <td>${app.applied_date || '-'}</td>
                <td><span class="badge ${statusClass}">${app.status}</span></td>
                <td>
                    <button onclick="editApp(${app.id})" class="btn-icon" title="Edit">✏️</button>
                    <button onclick="deleteApp(${app.id})" class="btn-icon" title="Delete">🗑️</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function renderBoard(data) {
    const columns = {
        'Applied': document.querySelector('#col-applied .column-cards'),
        'Interview': document.querySelector('#col-interview .column-cards'),
        'Offer': document.querySelector('#col-offer .column-cards'),
        'Rejected': document.querySelector('#col-rejected .column-cards')
    };

    // Reset columns
    Object.values(columns).forEach(col => { if(col) col.innerHTML = ''; });
    
    // Reset badges
    document.querySelectorAll('.count-badge').forEach(b => b.innerText = "0");

    const counts = { 'Applied': 0, 'Interview': 0, 'Offer': 0, 'Rejected': 0 };

    data.forEach(app => {
        if(!columns[app.status]) return;
        counts[app.status]++;
        
        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.draggable = true;
        card.id = 'app-card-' + app.id;
        card.ondragstart = (e) => {
            e.dataTransfer.setData('app_id', app.id);
        };

        card.innerHTML = `
            <div class="company">${app.company_name} <button onclick="editApp(${app.id})" class="btn-icon" style="padding:0;">✏️</button></div>
            <div class="role">${app.role}</div>
            <div class="date">${app.applied_date || ''} ${app.location ? '| ' + app.location : ''}</div>
        `;
        
        columns[app.status].appendChild(card);
    });

    Object.keys(counts).forEach(status => {
        const colHeader = document.querySelector(`#col-${status.toLowerCase()} .count-badge`);
        if(colHeader) colHeader.innerText = counts[status];
    });
}

// Drag & Drop Handlers
function allowDrop(event) {
    event.preventDefault();
    const column = event.target.closest('.board-column');
    if(column) column.classList.add('drag-over');
}

document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('dragleave', (e) => {
    const column = e.target.closest('.board-column');
    if(column) column.classList.remove('drag-over');
});

function handleDrop(event) {
    event.preventDefault();
    const column = event.target.closest('.board-column');
    
    document.querySelectorAll('.board-column').forEach(c => c.classList.remove('drag-over'));
    
    if(!column) return;
    
    const newStatus = column.getAttribute('data-status');
    const appId = event.dataTransfer.getData('app_id');
    
    if(!appId || !newStatus) return;

    // Find the app and update it locally right away for snappy UI, then sync
    const app = allApplications.find(a => a.id == appId);
    if(app && app.status !== newStatus) {
        app.status = newStatus;
        renderBoard(allApplications);
        renderTable(allApplications);

        // Sync to backend
        fetch(`/update/${app.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                company: app.company_name,
                role: app.role,
                status: app.status,
                date: app.applied_date,
                location: app.location || '',
                job_url: app.job_url || '',
                notes: app.notes || ''
            })
        }).then(() => {
            loadAnalytics(); // Refresh charts
        });
    }
}

function switchView(view) {
    document.querySelectorAll('.view-section').forEach(sec => sec.style.display = 'none');
    
    if (view === 'list') {
        document.getElementById('listViewBtn').classList.add('active');
        document.getElementById('boardViewBtn').classList.remove('active');
        document.getElementById('listView').style.display = 'block';
    } else {
        document.getElementById('boardViewBtn').classList.add('active');
        document.getElementById('listViewBtn').classList.remove('active');
        document.getElementById('boardView').style.display = 'flex';
    }
}

function submitForm() {
    if (editingAppId) updateApp();
    else addApplication();
}

function buildPayload() {
    return {
        company: document.getElementById("company").value,
        role: document.getElementById("role").value,
        status: document.getElementById("status").value,
        date: document.getElementById("date").value,
        location: document.getElementById("location").value,
        job_url: document.getElementById("job_url").value,
        notes: document.getElementById("notes").value
    };
}

function addApplication() {
    const payload = buildPayload();
    if (!payload.company || !payload.role || !payload.date) {
        alert("Please fill in required fields (Company, Role, Date)");
        return;
    }

    fetch("/add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    }).then(() => {
        loadApplications();
        loadAnalytics();
        clearForm();
    });
}

function editApp(id) {
    const app = allApplications.find(a => a.id === id);
    if (!app) return;

    editingAppId = id;
    document.getElementById("company").value = app.company_name || '';
    document.getElementById("role").value = app.role || '';
    document.getElementById("status").value = app.status || 'Applied';
    document.getElementById("date").value = app.applied_date || '';
    document.getElementById("location").value = app.location || '';
    document.getElementById("job_url").value = app.job_url || '';
    document.getElementById("notes").value = app.notes || '';

    document.getElementById("submitBtn").innerText = "Update Application";
    document.getElementById("cancelBtn").style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateApp() {
    const payload = buildPayload();
    if (!payload.company || !payload.role || !payload.date) {
        alert("Please fill in required fields (Company, Role, Date)");
        return;
    }

    fetch(`/update/${editingAppId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    }).then(() => {
        loadApplications();
        loadAnalytics();
        cancelEdit();
    });
}

function cancelEdit() {
    editingAppId = null;
    clearForm();
    document.getElementById("submitBtn").innerText = "Add Application";
    document.getElementById("cancelBtn").style.display = "none";
}

function clearForm() {
    document.getElementById("company").value = "";
    document.getElementById("role").value = "";
    document.getElementById("date").value = "";
    document.getElementById("status").value = "Applied";
    document.getElementById("location").value = "";
    document.getElementById("job_url").value = "";
    document.getElementById("notes").value = "";
}

function deleteApp(id) {
    if(!confirm("Are you sure you want to delete this application?")) return;
    
    fetch(`/delete/${id}`, { method: "DELETE" })
        .then(() => {
            loadApplications();
            loadAnalytics();
        });
}
