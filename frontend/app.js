const apiUrl = "http://localhost:3000/shorten";
const themeBtn = document.getElementById("toggleThemeBtn");

window.onload = async () => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    await loadShortUrls();
};

document.getElementById("urlForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const originalUrl = document.getElementById("originalUrl").value;
    const errorDiv = document.getElementById("error");
    const shortUrlText = document.getElementById("shortUrl");

    errorDiv.style.display = "none";

    if (!originalUrl) {
        errorDiv.style.display = "block";
        errorDiv.querySelector("p").textContent = "Please enter a valid URL!";
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ originalUrl })
        });

        const data = await response.json();

        if (response.ok) {
            shortUrlText.textContent = `${apiUrl}/${data.shortUrl}`;

            showToast("success", "The URL has been successfully shortened!\n");
            loadShortUrls();
        } else {
            errorDiv.style.display = "block";
            errorDiv.querySelector("p").textContent = data.error || "Error shortening URL!";
            showToast("error", data.error || "Error shortening URL!");
        }
    } catch (error) {
        errorDiv.style.display = "block";
        errorDiv.querySelector("p").textContent = "Error communicating with the server!";
        showToast("error", "Error communicating with the server!");
    }
});

async function deleteShortUrl(shortUrl) {
    try {
        const response = await fetch(`${apiUrl}/${shortUrl}`, {
            method: "DELETE",
        });

        if (response.ok) {
            showToast("success", "URL successfully deleted!");
            await loadShortUrls();
        } else {
            showToast("error", "Error deleting URL.");
        }
    } catch (error) {
        showToast("error", "Error when trying to delete the URL.");
    }
}

document.getElementById("deleteAllUrls").addEventListener("click", async (event) => {
    try {
        const response = await fetch(`${apiUrl}/deleteAll`, {
            method: "DELETE",
        });

        if (response.ok) {
            showToast("success", "Todas as URLs foram deletadas com sucesso!");
            await loadShortUrls();
        } else {
            showToast("error", "Erro ao deletar URL.");
        }
    } catch (error) {
        showToast("error", "Erro ao tentar deletar a URL.");
    }
})

async function loadShortUrls(page = 1) {
    const shortUrlsList = document.getElementById("shortUrlsList");
    const deleteAllBtn = document.getElementById("deleteAllUrls");
    shortUrlsList.innerHTML = "";

    const limit = 5;

    try {
        const response = await fetch(`${apiUrl}?page=${page}&limit=${limit}`);
        const data = await response.json();

        if (response.ok) {
            const currentPage = data.currentPage || 1;
            const totalPages = data.totalPages || 1;

            if (!data.urls || data.urls.length === 0) {
                shortUrlsList.innerHTML = "<li>Not Found.</li>";
                deleteAllBtn.hidden = true;
                generatePaginationControls(currentPage, totalPages);
                return;
            }

            data.urls.forEach(url => {
                const listItem = document.createElement("li");

                const shortUrlLink = document.createElement("a");
                shortUrlLink.href = `${apiUrl}/${url.shortUrl}`;
                shortUrlLink.textContent = `${apiUrl}/${url.shortUrl}`;

                const deleteUrl = document.createElement("button");
                deleteUrl.classList.add("delete-btn");
                deleteUrl.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';

                deleteUrl.addEventListener("click", () => {
                    if (confirm("Are you sure you want to delete all these URLs?")) {
                        deleteShortUrl(url.shortUrl);
                    }
                });

                listItem.appendChild(shortUrlLink);
                listItem.appendChild(deleteUrl);
                shortUrlsList.appendChild(listItem);
            });

            if (data.urls.length > 1) {
                deleteAllBtn.hidden = false;
            }
            generatePaginationControls(currentPage, totalPages);
        } else {
            shortUrlsList.innerHTML = "<li>Error loading shortened URLs.</li>";
            deleteAllBtn.hidden = true;
        }
    } catch (error) {
        shortUrlsList.innerHTML = "<li>Error communicating with the server!</li>";
        deleteAllBtn.hidden = true;
    }
}

function generatePaginationControls(currentPage, totalPages) {
    const paginationControls = document.getElementById("paginationControls");
    paginationControls.innerHTML = "";

    const visiblePages = 5;
    const halfVisible = Math.floor(visiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage <= halfVisible) {
        endPage = Math.min(totalPages, visiblePages);
    } else if (currentPage + halfVisible >= totalPages) {
        startPage = Math.max(1, totalPages - visiblePages + 1);
    }

    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "<";
        prevButton.onclick = () => loadShortUrls(currentPage - 1);
        paginationControls.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        pageButton.onclick = () => loadShortUrls(i);
        paginationControls.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = ">";
        nextButton.onclick = () => loadShortUrls(currentPage + 1);
        paginationControls.appendChild(nextButton);
    }

    const jumpToPage = document.createElement("input");
    jumpToPage.type = "number";
    jumpToPage.min = 1;
    jumpToPage.max = totalPages;
    jumpToPage.placeholder = `Ir para página (1-${totalPages})`;
    jumpToPage.onchange = () => {
        const page = parseInt(jumpToPage.value);
        if (page >= 1 && page <= totalPages) {
            loadShortUrls(page);
        } else {
            showToast("error", "Número de página inválido.");
        }
    };
    paginationControls.appendChild(jumpToPage);
}

function showToast(type, message) {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.classList.add("toast-custom", type === "success" ? "success" : "error");

    toast.innerHTML = `
        <div class="icon">${type === "success" ? "🟢" : "⚠️"}</div>
        <div class="message">${message}</div>
        <button class="close-toast">&times;</button>
    `;

    toast.querySelector(".close-toast").addEventListener("click", () => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    });

    container.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function setTheme(theme) {
    const themeLink = document.getElementById("themeStylesheet");
    themeLink.href = `themes/${theme}.css`;

    themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    localStorage.setItem("theme", theme);
}

themeBtn.addEventListener("click", () => {
    const currentTheme = localStorage.getItem("theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
});
