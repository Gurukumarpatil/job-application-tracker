document.addEventListener('DOMContentLoaded', () => {
    loadApplications();

    // Search and Filter functionality
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
    }

    searchInput.addEventListener('input', filterApplications);
    statusFilter.addEventListener('change', filterApplications);
});

let allApplications = [];
let editingAppId = null;

function loadApplications() {
    fetch("/applications")
        .then(res => res.json())
        .then(data => {
            allApplications = data;
            renderTable(allApplications);
        })
        .catch(err => console.error('Error loading applications:', err));
}

function renderTable(data) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; color:var(--text-muted); padding: 2rem;">
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
                <td><strong>${app.company_name}</strong></td>
                <td>${app.role}</td>
                <td><span class="badge ${statusClass}">${app.status}</span></td>
                <td>
                    <button onclick="editApp(${app.id})" class="btn-icon" title="Edit">
                        ✏️
                    </button>
                    <button onclick="deleteApp(${app.id})" class="btn-icon" title="Delete">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function submitForm() {
    if (editingAppId) {
        updateApp();
    } else {
        addApplication();
    }
}

function addApplication() {
    const company = document.getElementById("company").value;
    const role = document.getElementById("role").value;
    const status = document.getElementById("status").value;
    const date = document.getElementById("date").value;

    if (!company || !role || !date) {
        alert("Please fill in all fields");
        return;
    }

    fetch("/add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            company: company,
            role: role,
            status: status,
            date: date
        })
    }).then(() => {
        loadApplications();
        clearForm();
    });
}

function editApp(id) {
    const app = allApplications.find(a => a.id === id);
    if (!app) return;

    editingAppId = id;
    document.getElementById("company").value = app.company_name;
    document.getElementById("role").value = app.role;
    document.getElementById("status").value = app.status;
    document.getElementById("date").value = app.applied_date;

    // UI Updates
    document.getElementById("submitBtn").innerText = "Update Application";
    document.getElementById("cancelBtn").style.display = "inline-block";
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateApp() {
    const company = document.getElementById("company").value;
    const role = document.getElementById("role").value;
    const status = document.getElementById("status").value;
    const date = document.getElementById("date").value;

    if (!company || !role || !date) {
        alert("Please fill in all fields");
        return;
    }

    fetch(`/update/${editingAppId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            company: company,
            role: role,
            status: status,
            date: date
        })
    }).then(() => {
        loadApplications();
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
}

function deleteApp(id) {
    if(!confirm("Are you sure you want to delete this application?")) return;
    
    fetch(`/delete/${id}`, { method: "DELETE" })
        .then(() => loadApplications());
}
