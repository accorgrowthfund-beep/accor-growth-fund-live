
let tkn;

function getCookie(name) {
  return document.cookie.split("; ").reduce((acc, cookie) => {
    const [k, v] = cookie.split("=");
    return k === name ? decodeURIComponent(v) : acc;
  }, null);
}

function setCookie(name, value) {
  let expires = "";
  const date = new Date();
  date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
  expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

async function getTokenFromCookie() {
  const tokenStr = getCookie("a");

  if (!tokenStr) return null;

  try {
    return tokenStr;
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
}

window.onload = async () => {
  tkn = await getTokenFromCookie();
  if (tkn) {
    // fetchVacancies()
  } else {
    Toastify({
      text: "Do Loign First!",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "#FF5252"
      }
    }).showToast();
    window.location.href = "alogin.html"
  }

};

function hideShowSideBar() {
  let elements = document.getElementById("sidebar");
  elements.classList.toggle("collapsed");
}

function clearAllCookies() {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

    // Expire cookie for current path
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;

    // Also try to clear from common domains
    const domain = window.location.hostname.replace(/^www\./, "");
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${domain}`;
  }
}

function handleLogOut(event) {
  event.preventDefault();
  clearAllCookies();
  showToast("Logout successfull.", "#4CAF50")
  window.location.href = "alogin.html"
}

(async function getInfo() {
  let hash = window.location.hash;

  let checkSidebar = setInterval(() => {
    let sidebar = document.getElementById("sidebar");
    if (sidebar) {
      clearInterval(checkSidebar);

      let firstEle = sidebar.querySelector(".sidebar-links ul li");

      if (!hash || hash.trim() === "") {
        navigationClick(firstEle);
      } else {
        let allItems = Array.from(sidebar.querySelectorAll(".sidebar-links ul li"));
        let findEle = allItems.find(ele => ele.querySelector("a").getAttribute("href") === hash);
        if (findEle) {
          navigationClick(findEle);
        } else {
          navigationClick(firstEle);
        }
      }

    }
  }, 1000);
})();

// banner details 
function addBannerDetails() {
  const intervalId = setInterval(() => {
    const addFundDataForm = document.getElementById("addFundDataForm");

    if (!addFundDataForm) return;

    clearInterval(intervalId);

    addFundDataForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!tkn) return null;

      const data = [
        {
          title: "Invested Amount",
          investment: e.target.investedAmount_value.value,
          percentage: e.target.investedAmount_percentage.value,
          date: e.target.investedAmount_date.value,
        },
        {
          title: "XIRR",
          investment: e.target.xirr_value.value,
          percentage: e.target.xirr_percentage.value,
          date: e.target.xirr_date.value,
        },
        {
          title: "Committed Amount",
          investment: e.target.committed_value.value,
          percentage: e.target.committed_percentage.value,
          date: e.target.committed_date.value,
        },
        {
          title: "AUM",
          investment: e.target.aum_value.value,
          percentage: e.target.aum_percentage.value,
          date: e.target.aum_date.value,
        },
        {
          title: "Fund Start Date",
          investment: e.target.fundStart_value.value,
          percentage: e.target.fundStart_percentage.value,
          date: e.target.fundStart_date.value,
        },
        {
          title: "SEBI Registration",
          investment: e.target.sebi_value.value,
          percentage: e.target.sebi_percentage.value,
          date: e.target.sebi_date.value,
        },
      ];

      try {
        const response = await fetch("/api/banner-details/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": `${tkn || ""}`,
          },
          body: JSON.stringify({ data }),
        });

        const result = await response.json();
        if (response.ok) {
          Toastify({
            text: result?.message || "Fund data added successfully!",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "#4CAF50"
          }).showToast();
          e.target.reset();
          const modal = bootstrap.Modal.getInstance(document.getElementById("addFundDataModal"));
          modal.hide();
          fetchFundData();
        } else {
          Toastify({
            text: result.message || "Something went wrong",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "#FF5252"
          }).showToast();
        }
      } catch (err) {
        console.error(err);
        Toastify({
          text: err.message || "Something went wrong",
          duration: 2000,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF5252"
        }).showToast();
      }
    });
  }, 1000);
}
function editBannerDetails() {
  const intervalId = setInterval(() => {
    const editFundDataForm = document.getElementById("editFundDataForm");
    if (!editFundDataForm) return;

    clearInterval(intervalId);

    editFundDataForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!tkn) return null;

      const fundId = e.target.closest(".modal").getAttribute("data-id"); // hidden doc ID
      if (!fundId) return alert("Invalid fund ID");

      const data = [
        {
          title: "Invested Amount",
          investment: e.target.investedAmount_value.value,
          percentage: e.target.investedAmount_percentage.value,
          date: e.target.investedAmount_date.value,
        },
        {
          title: "XIRR",
          investment: e.target.xirr_value.value,
          percentage: e.target.xirr_percentage.value,
          date: e.target.xirr_date.value,
        },
        {
          title: "Committed Amount",
          investment: e.target.committed_value.value,
          percentage: e.target.committed_percentage.value,
          date: e.target.committed_date.value,
        },
        {
          title: "AUM",
          investment: e.target.aum_value.value,
          percentage: e.target.aum_percentage.value,
          date: e.target.aum_date.value,
        },
        {
          title: "Fund Start Date",
          investment: e.target.fundStart_value.value,
          percentage: e.target.fundStart_percentage.value,
          date: e.target.fundStart_date.value,
        },
        {
          title: "SEBI Registration",
          investment: e.target.sebi_value.value,
          percentage: e.target.sebi_percentage.value,
          date: e.target.sebi_date.value,
        },
      ];

      try {
        const response = await fetch("/api/banner-details/edit", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "authorization": `${tkn || ""}`,
          },
          body: JSON.stringify({ id: fundId, data }), // send as data array
        });

        const result = await response.json();
        if (response.ok) {
          Toastify({
            text: result?.message || "Fund data updated successfully!",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "#4CAF50"
          }).showToast();

          e.target.reset();
          const modal = bootstrap.Modal.getInstance(document.getElementById("editFundDataModal"));
          modal.hide();

          // Refresh data after update
          fetchFundData();
        } else {
          Toastify({
            text: result.message || "Something went wrong",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "#FF5252"
          }).showToast();
        }
      } catch (err) {
        console.error(err);
        Toastify({
          text: err.message || "Something went wrong",
          duration: 2000,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF5252"
        }).showToast();
      }
    });
  }, 1000);
}
async function EditModalDataFill(fundItem, id, uid) {
  let findIdInput = document.getElementById("editFundDataModal");
  if (fundItem?.length > 0 && findIdInput) {
    findIdInput.setAttribute("data-id", id);
    findIdInput.setAttribute("data-uid", uid);
    fundItem.forEach(item => {
      switch (item.title) {
        case "Invested Amount":
          document.querySelector('input[name="investedAmount_value"]').value = item.investment || '';
          document.querySelector('input[name="investedAmount_percentage"]').value = item.percentage || '';
          document.querySelector('input[name="investedAmount_date"]').value = item.date || '';
          break;

        case "XIRR":
          document.querySelector('input[name="xirr_value"]').value = item.investment || '';
          document.querySelector('input[name="xirr_percentage"]').value = item.percentage || '';
          document.querySelector('input[name="xirr_date"]').value = item.date || '';
          break;

        case "Committed Amount":
          document.querySelector('input[name="committed_value"]').value = item.investment || '';
          document.querySelector('input[name="committed_percentage"]').value = item.percentage || '';
          document.querySelector('input[name="committed_date"]').value = item.date || '';
          break;

        case "AUM":
          document.querySelector('input[name="aum_value"]').value = item.investment || '';
          document.querySelector('input[name="aum_percentage"]').value = item.percentage || '';
          document.querySelector('input[name="aum_date"]').value = item.date || '';
          break;

        case "Fund Start Date":
          document.querySelector('input[name="fundStart_value"]').value = item.investment || '';
          document.querySelector('input[name="fundStart_percentage"]').value = item.percentage || '';
          document.querySelector('input[name="fundStart_date"]').value = item.date || '';
          break;

        case "SEBI Registration":
          document.querySelector('input[name="sebi_value"]').value = item.investment || '';
          document.querySelector('input[name="sebi_percentage"]').value = item.percentage || '';
          document.querySelector('input[name="sebi_date"]').value = item.date || '';
          break;
      }
    });

    // modal.show();
  }
}
async function bannerDetails() {
  let findElement = document.querySelector(".dynamic_content");
  if (findElement) {
    if (findElement) {
      fetch("dash/dash-banner.html")
        .then(response => response.text())
        .then(html => {
          findElement.innerHTML = html;
          (async () => {
            await fetchFundData();
            await editBannerDetails();
          })();
        })
        .catch(error => console.error("Error loading sidebar:", error));
    }
  }
}
async function fetchFundData() {
  try {
    const response = await loadBannerDetails();
    const result = await response.json();

    if (response.ok) {
      const container = document.querySelector(".dash_banner");
      container.innerHTML = "";

      EditModalDataFill(result?.data?.data, result?.data?.id, result?.data?.uid);
      await setCookie("bd", JSON.stringify(result?.data))

      result?.data?.data?.forEach((item) => {
        const card = `
            <div class="col-12">
              <div class="card h-100 shadow border-0">
                <div class="card-body text-center">
                  <h5 class="card-title fw-bold">${item.title}</h5>
                  <p class="fs-5 mb-1">${item.investment || "--"}</p>
                  <p class="text-success fw-semibold mb-1">${item.percentage || "--"}</p>
                  <p class="text-muted small">${item.date || ""}</p>
                </div>
              </div>
            </div>
          `;
        container.insertAdjacentHTML("beforeend", card);
      });
    } else {
      console.error("Error:", result.message);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
async function selectFirstElement() {
  let firstEle = document.querySelector(".sidebar-links ul li");
  if (firstEle) {
    firstEle.classList.add("active");
    const anchor = firstEle.querySelector("a").getAttribute("href");
    history.replaceState(null, null, anchor);
    hideShowSideBar();
    bannerDetails();
  }
  addBannerDetails();
}

// chart details 
async function fetchChartData() {
  try {
    const response = await loadChartDetails();
    const data = await response.json();

    if (response.ok) {
      openEditModal(data?.data)
      populateChartTable(data?.data)
    } else {
      console.error("Error:", data.message);
    }

  } catch (error) {
    console.log(error?.message);
    console.log(error);
  }
}
function populateChartTable(chartData) {
  const tbody = document.querySelector('.dash-chart tbody');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <th>NAV</th>
      <td>${chartData.nav}</td>
    </tr>
    <tr>
      <th>Date</th>
      <td>${chartData.date}</td>
    </tr>
    <tr>
      <th>Growth Since Inception</th>
      <td>${chartData.GrowthSinceInception}</td>
    </tr>
    <tr>
      <th>Categories (Months)</th>
      <td>${chartData.categories.join(', ')}</td>
    </tr>
    <tr>
      <th>Series Data</th>
      <td>
        ${chartData.series
      .map(s => `<strong>${s.name}:</strong> ${s.data.join(', ')}`)
      .join('<br>')}
      </td>
    </tr>
    <tr>
      <th>Colors</th>
      <td>${chartData.colors.join(', ')}</td>
    </tr>
    <tr>
      <th>Notes / Lines</th>
      <td>
        ${chartData.lines.map(line => `- ${line}`).join('<br>')}
      </td>
    </tr>
  `;
}
async function loadChartData() {
  let findElement = document.querySelector(".dynamic_content");
  if (findElement) {
    if (findElement) {
      fetch("dash/dash-chart.html")
        .then(response => response.text())
        .then(html => {
          findElement.innerHTML = html;
          (async () => {
            let response = await fetchChartData();

          })();
        })
        .catch(error => console.error("Error loading sidebar:", error));
    }
  }
}
async function addChartData(e) {
  e.preventDefault();

  try {
    // Collect form values (your existing validation code)
    const nav = document.getElementById('nav').value.trim();
    const date = document.getElementById('date').value.trim();
    const growth = document.getElementById('growth').value.trim();

    if (!nav) return showToast("NAV is required!");
    if (!date) return showToast("Date is required!");
    if (!growth) return showToast("Growth Since Inception is required!");

    // Series
    const seriesDivs = document.querySelectorAll('.series-container > div');
    const series = Array.from(seriesDivs).map(div => {
      const name = div.querySelector('.series-name').value.trim();
      const dataRaw = div.querySelector('.series-data').value.trim();

      const dataStrings = dataRaw.split(',');
      if (dataStrings.some(x => x.trim() === '')) throwToast(`Series "${name}" has empty values!`);

      const data = dataStrings.map(x => {
        const num = Number(x.trim());
        if (isNaN(num)) throwToast(`Series "${name}" has invalid number: "${x}"`);
        return num;
      });

      if (!name) throwToast(`Series name is required!`);
      return { name, data };
    });

    if (series.length < 2) return showToast("Minimum 2 series are required!");

    // Categories & Colors
    const categoriesRaw = document.getElementById('categories').value.trim();
    const colorsRaw = document.getElementById('colors').value.trim();

    if (!categoriesRaw) return showToast("Categories are required!");
    if (!colorsRaw) return showToast("Colors are required!");

    const categories = categoriesRaw.split(',').map(x => x.trim());
    const colors = colorsRaw.split(',').map(x => x.trim());

    if (colors.length !== series.length) return showToast("Number of colors must equal number of series!");

    const hexRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    for (let color of colors) {
      if (!hexRegex.test(color)) return showToast(`Invalid color: "${color}". Use hex format like #39acab`);
    }

    // Lines / Notes
    const lines = document.getElementById('lines').value
      .split('\n')
      .map(x => x.trim())
      .filter(x => x !== '');
    if (lines.length < 1) return showToast("At least 1 note is required!");

    // Payload
    const payload = {
      nav,
      date,
      GrowthSinceInception: growth,
      series,
      categories,
      colors,
      lines
    };

    // Call API
    const response = await fetch('/api/chart-details/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
      return showToast(result.message || 'Failed to add chart data');
    }

    showToast(`${result.message || 'Chart data added successfully!'}`, 'green');
    document.getElementById('chartForm').reset();

    const modalEl = document.getElementById('chartModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    fetchChartData();

  } catch (err) {
    console.error(err);
    showToast(err.message || 'An error occurred');
  }
}
// Add series input for edit modal
let editSeriesCount = 0;
function addEditSeries(name = '', values = '') {
  editSeriesCount++;
  const container = document.querySelector('.edit-series-container');
  const div = document.createElement('div');
  div.classList.add('mb-2', 'd-flex', 'gap-2', 'align-items-centter');
  div.innerHTML = `
        <input type="text" class="form-control edit-series-name" placeholder="Series Name" value="${name}">
        <input type="text" class="form-control edit-series-data" placeholder="Comma separated data" value="${values}">
        <button type="button" class="btn btn-danger btn-sm remove-edit-series">Remove</button>
    `;
  container.appendChild(div);

  div.querySelector('.remove-edit-series').addEventListener('click', () => {
    if (container.children.length > 2) div.remove(); // minimum 2 series
  });
}
function openEditModal(chart) {
  document.getElementById('editChartId').value = chart.id;
  document.getElementById('editNav').value = chart.nav;
  document.getElementById('editDate').value = chart.date;
  document.getElementById('editGrowth').value = chart.GrowthSinceInception;

  // Series
  const container = document.querySelector('.edit-series-container');
  container.innerHTML = '';
  chart.series.forEach(s => addEditSeries(s.name, s.data.join(',')));

  document.getElementById('editCategories').value = chart.categories.join(', ');
  document.getElementById('editColors').value = chart.colors.join(', ');
  document.getElementById('editLines').value = chart.lines.join('\n');
}
async function updateChartData(e) {
  e.preventDefault();
  try {
    // Collect form values (your existing validation code)
    const id = document.getElementById('editChartId').value;
    const nav = document.getElementById('editNav').value.trim();
    const date = document.getElementById('editDate').value.trim();
    const growth = document.getElementById('editGrowth').value.trim();

    if (!nav) return showToast("NAV is required!");
    if (!date) return showToast("Date is required!");
    if (!growth) return showToast("Growth Since Inception is required!");

    // Series
    const seriesDivs = document.querySelectorAll('.edit-series-container > div');
    const series = Array.from(seriesDivs).map(div => {
      const name = div.querySelector('.edit-series-name').value.trim();
      const dataRaw = div.querySelector('.edit-series-data').value.trim();

      const dataStrings = dataRaw.split(',');
      if (dataStrings.some(x => x.trim() === '')) throwToast(`Series "${name}" has empty values!`);

      const data = dataStrings.map(x => {
        const num = Number(x.trim());
        if (isNaN(num)) throwToast(`Series "${name}" has invalid number: "${x}"`);
        return num;
      });

      if (!name) throwToast(`Series name is required!`);
      return { name, data };
    });

    if (series.length < 2) return showToast("Minimum 2 series are required!");

    // Categories & Colors
    const categoriesRaw = document.getElementById('editCategories').value.trim();
    const colorsRaw = document.getElementById('editColors').value.trim();
    if (!categoriesRaw) return showToast("Categories are required!");
    if (!colorsRaw) return showToast("Colors are required!");
    const categories = categoriesRaw.split(',').map(x => x.trim());
    const colors = colorsRaw.split(',').map(x => x.trim());
    if (colors.length !== series.length) return showToast("Number of colors must equal number of series!");
    const hexRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
    for (let color of colors) {
      if (!hexRegex.test(color)) return showToast(`Invalid color: "${color}". Use hex format like #39acab`);
    }

    // Lines / Notes
    const lines = document.getElementById('editLines').value
      .split('\n')
      .map(x => x.trim())
      .filter(x => x !== '');
    if (lines.length < 1) return showToast("At least 1 note is required!");

    // Payload
    const payload = {
      id: id,
      data: {
        nav,
        date,
        GrowthSinceInception: growth,
        series,
        categories,
        colors,
        lines
      }
    };
    // Call API
    const response = await fetch(`/api/chart-details/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) {
      return showToast(result.message || 'Failed to add chart data');
    }
    showToast(`${result.message || 'Chart data Updated successfully!'}`, 'green');
    document.getElementById('editChartForm').reset();

    const modalEl = document.getElementById('editChartModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    fetchChartData()
  } catch (err) {
    console.error(err);
    showToast(err.message || 'An error occurred');
  }
}

// Helper function for Toastify
function showToast(msg, bgColor = "#FF0000") {
  Toastify({
    text: msg,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: bgColor
  }).showToast();
}
// Helper for throwing error in series map
function throwToast(msg) {
  showToast(msg);
  throw new Error(msg);
}
let seriesCount = 0;
// Function to create a series input
function addSeries(name = '', values = '') {
  let seriesContainer = document.querySelector('.series-container');
  seriesCount++;
  const div = document.createElement('div');
  div.classList.add('mb-2', 'd-flex', 'gap-2', 'align-items-centter');
  div.innerHTML = `
    <input type="text" class="form-control series-name" placeholder="Series Name" value="${name}">
    <input type="text" class="form-control series-data" placeholder="Comma separated data" value="${values}">
    <button type="button" class="btn btn-danger btn-sm remove-series">Remove</button>
  `;
  seriesContainer.appendChild(div);
  div.querySelector('.remove-series').addEventListener('click', () => {
    if (seriesContainer.children.length > 2) { // only remove if >2
      seriesContainer.removeChild(div);
      updateRemoveButtons();
    }
  });
  updateRemoveButtons();
}

function updateRemoveButtons() {
  let seriesContain = document.querySelector('.series-container');
  const removeButtons = seriesContain.querySelectorAll('.remove-series');
  removeButtons.forEach(btn => {
    if (seriesContain.children.length <= 2) {
      btn.disabled = true; // disable button
    } else {
      btn.disabled = false; // enable button
    }
  });
}

function navigationClick(li) {
  document.querySelectorAll("#sidebar .sidebar-links li.active").forEach(item => {
    item.className = ""
  });
  li.classList.add("active");
  const anchor = li.querySelector("a").getAttribute("href");
  const section = document.querySelector(anchor);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
  checkCurrentElement(anchor);
}
async function fetchTableData() {
  try {
    const response = await loadTableDetails();
    const data = await response.json();

    if (response.ok) {
      populateTable(data.data); // <-- pass only the array of IPO objects
    } else {
      console.error("Error:", data.message);
    }

  } catch (error) {
    console.error("Fetch Table Error:", error?.message || error);
  }
}

function populateTable(chartDataArray) {
  const tbody = document.querySelector('.dash-table tbody');
  if (!tbody) return;

  // Clear previous rows
  tbody.innerHTML = '';

  chartDataArray.forEach(chartData => {
    const tr = document.createElement('tr');

    // Format Listing Date nicely (e.g., Dec 03, 2024)
    const listingDate = chartData.listing_date
      ? new Date(chartData.listing_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      })
      : '-';

    // Create table cells
    const cells = [
      chartData.company_name || '-',
      chartData.issue_type || '-',
      chartData.lead_manager || '-',
      listingDate,
      chartData.amount_invested || '-'
    ];

    // Append normal data cells
    cells.forEach(value => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });

    // Create action cell
    const actionTd = document.createElement('td');
    actionTd.innerHTML = `
      <button class="edit-btn" data-id="${chartData?.id}" style="margin-right:8px; background:#4CAF50; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Edit</button>
      <button class="delete-btn" data-id="${chartData?.id}" style="background:#f44336; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Delete</button>
    `;
    tr.appendChild(actionTd);

    tbody.appendChild(tr);
  });

  // ==============================
  // Edit Button Click Handler
  // ==============================
  // ==============================
  // Edit Button Click Handler
  // ==============================
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      const row = e.target.closest('tr');
      const cells = row.querySelectorAll('td');

      // Extract existing row values
      const [company_name, issue_type, lead_manager, listing_date, amount_invested] = Array.from(cells)
        .slice(0, 5)
        .map(td => td.textContent.trim());

      // Fill modal fields
      const modal = document.getElementById('editTableModal');
      if (modal) {
        modal.setAttribute('data-id', id);
      }

      const form = modal.querySelector('#editTableForm');
      const elements = form.elements;

      elements.company_name.value = company_name;
      elements.issue_type.value = issue_type;
      elements.lead_manager.value = lead_manager;
      elements.listing_date.value =
        listing_date && listing_date !== '-'
          ? new Date(listing_date).toISOString().split('T')[0]
          : '';
      elements.amount_invested.value = amount_invested;

      // Show edit modal
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    });
  });


  // ==============================
  // Delete Button Click Handler
  // ==============================
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      const id = e.target.getAttribute('data-id');
      if (!id) return;

      if (!confirm('Are you sure you want to delete this record?')) return;

      try {
        const response = await fetch('/api/table-details/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            authorization: `${tkn || ''}`,
          },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();

        if (response.ok) {
          Toastify({
            text: result?.message || 'Record deleted successfully!',
            duration: 2000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#4CAF50',
          }).showToast();

          fetchTableData(); // Refresh table
        } else {
          Toastify({
            text: result.message || 'Failed to delete record',
            duration: 2000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#FF5252',
          }).showToast();
        }
      } catch (err) {
        console.error(err);
        Toastify({
          text: err.message || 'Something went wrong while deleting',
          duration: 2000,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#FF5252',
        }).showToast();
      }
    });
  });
}

async function loadTableData() {
  let findElement = document.querySelector(".dynamic_content");
  if (findElement) {
    if (findElement) {
      fetch("dash/dash-table.html")
        .then(response => response.text())
        .then(html => {
          findElement.innerHTML = html;
          (async () => {
            await fetchTableData();
            await addTableDetails();
          })();
        })
        .catch(error => console.error("Error loading sidebar:", error));
    }
  }
}

function addTableDetails() {
  const intervalId = setInterval(() => {
    const addFundDataForm = document.getElementById("addFundTableModal");

    if (!addFundDataForm) return;

    clearInterval(intervalId);

    addFundDataForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!tkn) return null;

      const data = {
        company_name: e.target.company_name.value,
        issue_type: e.target.issue_type.value,
        lead_manager: e.target.lead_manager.value,
        listing_date: e.target.listing_date.value,
        amount_invested: e.target.amount_invested.value,
      }

      try {
        const response = await fetch("/api/table-details/edit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": `${tkn || ""}`,
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
          Toastify({
            text: result?.message || "Fund data added successfully!",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "#4CAF50"
          }).showToast();
          e.target.reset();
          const modal = bootstrap.Modal.getInstance(document.getElementById("addFundTableModal"));
          modal.hide();
          fetchTableData();
        } else {
          Toastify({
            text: result.message || "Something went wrong",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "#FF5252"
          }).showToast();
        }
      } catch (err) {
        console.error(err);
        Toastify({
          text: err.message || "Something went wrong",
          duration: 2000,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF5252"
        }).showToast();
      }
    });
  }, 1000);
}
function editTableDetails() {
  const intervalId = setInterval(() => {
    const editFundDataForm = document.getElementById("editTableModal");
    if (!editFundDataForm) return;

    clearInterval(intervalId);

    editFundDataForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (!tkn) return null;

      const fundId = e.target.closest(".modal").getAttribute("data-id");
      if (!fundId) return alert("Invalid fund ID");

      const data = {
        company_name: e.target.company_name.value,
        issue_type: e.target.issue_type.value,
        lead_manager: e.target.lead_manager.value,
        listing_date: e.target.listing_date.value,
        amount_invested: e.target.amount_invested.value,
      };

      try {
        const response = await fetch("/api/table-details/edit", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "authorization": `${tkn || ""}`,
          },
          body: JSON.stringify({ id: fundId, data }),
        });

        const result = await response.json();
        if (response.ok) {
          Toastify({
            text: result?.message || "Fund data updated successfully!",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "#4CAF50"
          }).showToast();

          e.target.reset();
          const modal = bootstrap.Modal.getInstance(document.getElementById("editTableModal"));
          modal.hide();

          // Refresh data
          fetchTableData();
        } else {
          Toastify({
            text: result.message || "Something went wrong",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "#FF5252"
          }).showToast();
        }
      } catch (err) {
        console.error(err);
        Toastify({
          text: err.message || "Something went wrong",
          duration: 2000,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF5252"
        }).showToast();
      }
    });
  }, 1000);
}
editTableDetails();
// ✅ Load Blog Page

// ✅ Fetch blog data and populate table
let blogsData = []; // store globally

async function fetchBlogData() {
  try {
    const response = await fetch("/api/blog-details/get", {
      headers: { authorization: tkn || "" }
    });
    const result = await response.json();

    const tbody = document.querySelector(".blog-table tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (response.ok && result.data && Array.isArray(result.data?.data)) {
      blogsData = result.data?.data;

      result.data?.data.forEach(blog => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><img src="${blog.thumbnail}" width="80" /></td>
          <td><b>${blog?.author}</b></td>
          <td>${blog?.short_desc_list}</td>
          <td>${blog?.created_date}</td>
          <td>${blog?.updated_date}</td>
          <td>
            <button class="edit-btn" style="margin-right:8px; background:#4CAF50; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" data-id="${blog.id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${blog.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      attachBlogEvents?.();
    } else {
      console.warn("No blog data found.");
    }
  } catch (err) {
    console.error("Error fetching blog data:", err);
  }
}

// Global Quill editor instances
let addQuill = null;
let editQuill = null;

// Initialize Quill editor for Add Form
function initAddFormEditor() {
  // Remove existing instance if present
  if (addQuill) {
    addQuill = null;
  }

  const editorContainer = document.getElementById('addBlogEditor');
  if (!editorContainer) {
    console.error('Add editor container not found');
    return;
  }

  // Clear any existing content
  editorContainer.innerHTML = '';

  // Initialize Quill
  addQuill = new Quill('#addBlogEditor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ]
    },
    placeholder: 'Write your blog content here...'
  });

}

// Initialize Quill editor for Edit Form
function initEditFormEditor(content = '') {
  // Remove existing instance if present
  if (editQuill) {
    editQuill = null;
  }

  const editorContainer = document.getElementById('editBlogEditor');
  if (!editorContainer) {
    console.error('Edit editor container not found');
    return;
  }

  // Clear any existing content
  editorContainer.innerHTML = '';

  // Initialize Quill
  editQuill = new Quill('#editBlogEditor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ]
    },
    placeholder: 'Write your blog content here...'
  });

  // Set content if provided
  if (content) {
    editQuill.root.innerHTML = content;
  }

}

// ✅ Add blog
async function addBlog() {
  const form = document.getElementById("addBlogForm");
  if (!form) return;

  // Remove any existing listeners
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get HTML content from Quill editor
    const description = addQuill ? addQuill.root.innerHTML : '';

    const thumbFileInput = document.getElementById('thumbnailFile');
    const detailFileInput = document.getElementById('detailFile');

    let thumbnailUrl = newForm.thumbnail.value.trim();
    let detailUrl = newForm.detail_image.value.trim();
    const thumbStatus = document.getElementById("thumbStatus");
    const detailStatus = document.getElementById("detailStatus");

    if (thumbFileInput && thumbFileInput.files.length > 0) {
      thumbnailUrl = await uploadToFirebase(thumbFileInput.files[0], "blogs/thumbnails", thumbStatus);
    }

    // Upload detail image if selected
    if (detailFileInput && detailFileInput.files.length > 0) {
      detailUrl = await uploadToFirebase(detailFileInput.files[0], "blogs/details", detailStatus);
    }

    if (!thumbnailUrl || !detailUrl) {
      return
    }

    const data = {
      thumbnail: thumbnailUrl,
      detail_image: detailUrl,
      author: newForm.author.value.trim(),
      short_desc_list: newForm.short_desc_list.value.trim(),
      short_desc_detail: newForm.short_desc_detail.value.trim(),
      description: description
    };

    try {
      const response = await fetch("/api/blog-details/add-edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: tkn || ""
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      Toastify({
        text: result.message || "Something went wrong",
        duration: 2000,
        gravity: "top",
        position: "right",
        backgroundColor: response.ok ? "#4CAF50" : "#FF5252"
      }).showToast();

      if (response.ok) {
        newForm.reset();
        // Clear Quill editor
        if (addQuill) {
          addQuill.setContents([]);
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById("addBlogModal"));
        if (modal) modal.hide();
        fetchBlogData();
      }
    } catch (err) {
      console.error("Error adding blog:", err);
      Toastify({
        text: "Failed to add blog",
        duration: 2000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF5252"
      }).showToast();
    }
  });
}

// async function uploadToFirebase(file, folder, statusElement) {
//   if (!file) return "";
//   const storage = firebase.storage();
//   statusElement.textContent = "Uploading...";
//   const storageRef = storage.ref(`${folder}/${Date.now()}_${file.name}`);
//   const snapshot = await storageRef.put(file);
//   const url = await snapshot.ref.getDownloadURL();
//   statusElement.textContent = "✅ Uploaded successfully";
//   return url;
// }

async function uploadToFirebase(file, folder, statusElement) {
  if (!file) return "";
  statusElement.textContent = "Uploading...";

  try {
    // Convert file to base64
    const reader = new FileReader();

    const fileData = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Upload via your API route
    const response = await fetch('/api/blog-details/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: fileData,
        folder: folder,
        fileName: file.name
      }),
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    statusElement.textContent = "✅ Uploaded successfully";
    return data.url;

  } catch (error) {
    console.error('Upload failed:', error);
    statusElement.textContent = "❌ Upload failed";
    return "";
  }
}

// Edit blog
function attachBlogEvents() {
  // ✏️ Handle Edit Blog
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const blogId = btn.dataset.id;
      const blog = blogsData.find((b) => b.id === blogId);

      if (!blog) {
        Toastify({
          text: "Blog not found",
          duration: 2000,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF5252",
        }).showToast();
        return;
      }

      // 🔧 Dynamically fill edit form (now with labels)
      const form = document.getElementById("editBlogForm");
      // <div class="col-md-6">
      //   <label class="form-label fw-bold">Thumbnail URL</label>
      //   <input type="text" class="form-control" name="thumbnail"
      //     value="${blog.thumbnail || ""}" placeholder="Enter thumbnail URL" />
      // </div>

      // <div class="col-md-6">
      //   <label class="form-label fw-bold">Detail Image URL</label>
      //   <input type="text" class="form-control" name="detail_image"
      //     value="${blog.detail_image || ""}" placeholder="Enter detail image URL" />
      // </div>
      form.innerHTML = `
        <input type="hidden" name="id" value="${blog.id}" />

  <!-- Thumbnail Upload -->
  <div class="col-md-6">
    <label class="form-label fw-bold">Thumbnail Image</label>
    <div class="input-group">
      <input type="text" class="form-control" name="thumbnail"
        value="${blog.thumbnail || ""}" placeholder="Thumbnail URL" readonly>
      <input type="file" id="editThumbnailFile" class="form-control" accept="image/*" style="max-width:200px;">
    </div>
    <small id="editThumbStatus" class="text-muted"></small>
  </div>

  <!-- Detail Image Upload -->
  <div class="col-md-6">
    <label class="form-label fw-bold">Detail Image</label>
    <div class="input-group">
      <input type="text" class="form-control" name="detail_image"
        value="${blog.detail_image || ""}" placeholder="Detail image URL" readonly>
      <input type="file" id="editDetailFile" class="form-control" accept="image/*" style="max-width:200px;">
    </div>
    <small id="editDetailStatus" class="text-muted"></small>
  </div>

        <div class="col-md-6">
          <label class="form-label fw-bold">Author</label>
          <input type="text" class="form-control" name="author"
            value="${blog.author || ""}" placeholder="Enter author name" />
        </div>

        <div class="col-12">
          <label class="form-label fw-bold">Short Description List</label>
          <input type="text" class="form-control" name="short_desc_list"
            value="${blog?.short_desc_list || ""}"
            placeholder="Comma separated short points" />
        </div>

        <div class="col-12">
          <label class="form-label fw-bold">Short Description Detail</label>
          <textarea class="form-control" name="short_desc_detail" rows="3"
            placeholder="Enter short description detail">${blog.short_desc_detail || ""}</textarea>
        </div>

        <div class="col-12">
          <label class="form-label fw-bold">Full Description</label>
          <div id="editBlogEditor" style="height: 300px; background: white;"></div>
          <input type="hidden" name="description" id="editBlogDescription">
        </div>
      `;

      // 🪟 Show modal
      const modal = new bootstrap.Modal(document.getElementById("editBlogModal"));
      modal.show();

      // Initialize Quill editor after modal is visible
      setTimeout(() => {
        initEditFormEditor(blog.description || '');
      }, 150);

      // 💾 Submit handler
      // form.addEventListener(
      //   "submit",
      //   async (e) => {
      //     e.preventDefault();

      //     const description = editQuill ? editQuill.root.innerHTML : '';

      //     const updatedData = {
      //       id: blog.id,
      //       detail_image: form.detail_image.value.trim(),
      //       thumbnail: form.thumbnail.value.trim(),
      //       author: form.author.value.trim(),
      //       short_desc_list: form.short_desc_list.value.trim(),
      //       short_desc_detail: form.short_desc_detail.value.trim(),
      //       description: description,
      //     };

      //     try {
      //       const res = await fetch("/api/blog-details/add-edit", {
      //         method: "PUT",
      //         headers: {
      //           "Content-Type": "application/json",
      //           authorization: tkn || "",
      //         },
      //         body: JSON.stringify(updatedData),
      //       });

      //       const result = await res.json();

      //       Toastify({
      //         text: result.message || "Blog updated",
      //         duration: 2000,
      //         gravity: "top",
      //         position: "right",
      //         backgroundColor: res.ok ? "#4CAF50" : "#FF5252",
      //       }).showToast();

      //       if (res.ok) {
      //         modal.hide();
      //         await fetchBlogData();
      //       }
      //     } catch (err) {
      //       console.error("Error updating blog:", err);
      //       Toastify({
      //         text: "Failed to update blog",
      //         duration: 2000,
      //         gravity: "top",
      //         position: "right",
      //         backgroundColor: "#FF5252",
      //       }).showToast();
      //     }
      //   },
      //   { once: true }
      // );
      form.addEventListener(
        "submit",
        async (e) => {
          e.preventDefault();

          const description = editQuill ? editQuill.root.innerHTML : "";

          // File inputs
          const thumbFileInput = document.getElementById("editThumbnailFile");
          const detailFileInput = document.getElementById("editDetailFile");

          let thumbnailUrl = form.thumbnail.value.trim();
          let detailUrl = form.detail_image.value.trim();

          if (thumbFileInput && thumbFileInput.files.length > 0) {
            thumbnailUrl = await uploadToFirebase(
              thumbFileInput.files[0],
              "blogs/thumbnails",
              document.getElementById("editThumbStatus")
            );
          }

          if (detailFileInput && detailFileInput.files.length > 0) {
            detailUrl = await uploadToFirebase(
              detailFileInput.files[0],
              "blogs/details",
              document.getElementById("editDetailStatus")
            );
          }

          const updatedData = {
            id: blog.id,
            thumbnail: thumbnailUrl,
            detail_image: detailUrl,
            author: form.author.value.trim(),
            short_desc_list: form.short_desc_list.value.trim(),
            short_desc_detail: form.short_desc_detail.value.trim(),
            description,
          };

          try {
            const res = await fetch("/api/blog-details/add-edit", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: tkn || "",
              },
              body: JSON.stringify(updatedData),
            });

            const result = await res.json();

            Toastify({
              text: result.message || "Blog updated",
              duration: 2000,
              gravity: "top",
              position: "right",
              backgroundColor: res.ok ? "#4CAF50" : "#FF5252",
            }).showToast();

            if (res.ok) {
              modal.hide();
              await fetchBlogData();
            }
          } catch (err) {
            console.error("Error updating blog:", err);
            Toastify({
              text: "Failed to update blog",
              duration: 2000,
              gravity: "top",
              position: "right",
              backgroundColor: "#FF5252",
            }).showToast();
          }
        },
        { once: true }
      );

    });
  });

  // 🗑 Handle Delete Blog
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const blogId = btn.dataset.id;

      if (!confirm("Are you sure you want to delete this blog?")) return;

      try {
        const res = await fetch("/api/blog-details/add-edit", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: tkn || "",
          },
          body: JSON.stringify({ id: blogId }),
        });

        const result = await res.json();

        Toastify({
          text: result.message || "Blog deleted",
          duration: 2000,
          gravity: "top",
          position: "right",
          backgroundColor: res.ok ? "#4CAF50" : "#FF5252",
        }).showToast();

        if (res.ok) await fetchBlogData();
      } catch (err) {
        console.error("Error deleting blog:", err);
        Toastify({
          text: "Failed to delete blog",
          duration: 2000,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF5252",
        }).showToast();
      }
    });
  });
}

// Load blog data with proper initialization
async function loadBlogData() {
  let findElement = document.querySelector(".dynamic_content");
  if (findElement) {
    try {
      const response = await fetch("dash/dash-blog.html");
      const html = await response.text();
      findElement.innerHTML = html;

      // Wait for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Initialize everything in order
      await fetchBlogData();

      // Initialize add form editor when modal is shown
      const addModal = document.getElementById('addBlogModal');
      if (addModal) {
        addModal.addEventListener('shown.bs.modal', function () {
          if (!addQuill) {
            initAddFormEditor();
          }
        });
      }

      // Setup add blog form handler
      addBlog();

    } catch (error) {
      console.error("Error loading blog data:", error);
    }
  }
}

// Cleanup when edit modal is hidden
document.getElementById('editBlogModal')?.addEventListener('hidden.bs.modal', function () {
  const editEditor = tinymce.get('editBlogDescription');
  if (editEditor) {
    tinymce.remove('#editBlogDescription');
  }
});

// Initialize on page load

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  fetchBlogData();
});


// Skeleton for Blog List Page

function showBlogListSkeleton(container, count = 6) {
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const col = document.createElement("div");
    col.className = "col-md-6 col-xl-4";

    col.innerHTML = `
      <div class="blog-block-two mb-30">
        <div class="inner-box">
          <div class="image-box">
            <figure class="image skeleton-loader">
              <div class="skeleton-img"></div>
              <span class="skeleton-tag"></span>
            </figure>
          </div>
          <div class="content-box">
            <ul class="info">
              <li>
                <div class="skeleton-text skeleton-author"></div>
              </li>
            </ul>
            <h4 class="title">
              <div class="skeleton-text skeleton-title"></div>
              <div class="skeleton-text skeleton-title-short"></div>
            </h4>
            <div class="skeleton-btn mt-30"></div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(col);
  }
}


function showBlogDetailSkeleton() {

  const detailImg = document.querySelector(".blog-details__img");

  if (detailImg) {
    detailImg.innerHTML = `
      <div class="skeleton-detail-img"></div>
      <div class="blog-details__date">
        <span class="day skeleton-date-box"></span>
      </div>
    `;
  }

  // Title skeleton
  const titleElem = document.querySelector(".blog-details__title");
  if (titleElem) {
    titleElem.innerHTML = `
      <div class="skeleton-text skeleton-detail-title"></div>
      <div class="skeleton-text skeleton-detail-title-short"></div>
    `;
  }

  // Content skeleton
  const contentDiv = document.querySelector(".blog-details__content");
  if (contentDiv) {
    // Keep the meta info, just add skeleton to it
    const metaList = contentDiv.querySelector(".blog-details__meta");
    if (metaList) {
      metaList.innerHTML = `
        <li><div class="skeleton-text skeleton-meta"></div></li>
      `;
    }

    // Add skeleton paragraphs after meta
    const skeletonContent = `
      <div class="skeleton-content-block">
        <div class="skeleton-text skeleton-paragraph"></div>
        <div class="skeleton-text skeleton-paragraph"></div>
        <div class="skeleton-text skeleton-paragraph-short"></div>
      </div>
      <div class="skeleton-content-block">
        <div class="skeleton-text skeleton-paragraph"></div>
        <div class="skeleton-text skeleton-paragraph"></div>
        <div class="skeleton-text skeleton-paragraph"></div>
        <div class="skeleton-text skeleton-paragraph-short"></div>
      </div>
      <div class="skeleton-content-block">
        <div class="skeleton-text skeleton-paragraph"></div>
        <div class="skeleton-text skeleton-paragraph"></div>
      </div>
    `;

    // Insert after title
    const existingTitle = contentDiv.querySelector("h3");
    if (existingTitle) {
      existingTitle.insertAdjacentHTML('afterend', skeletonContent);
      existingTitle.style.display = 'none';
    }
  }

  // Prev/Next skeleton
  const prevElem = document.querySelector(".nav-links .prev");
  const nextElem = document.querySelector(".nav-links .next");

  if (prevElem) {
    prevElem.innerHTML = `
      <a href="#" style="pointer-events: none;">
        <div class="skeleton-nav-img"></div>
        <div class="skeleton-text skeleton-nav-text"></div>
      </a>
    `;
  }

  if (nextElem) {
    nextElem.innerHTML = `
      <a href="#" style="pointer-events: none;">
        <div class="skeleton-text skeleton-nav-text"></div>
        <div class="skeleton-nav-img"></div>
      </a>
    `;
  }
}

// Skeleton for Sidebar
function showSidebarSkeleton() {
  const sidebarList = document.querySelector('.sidebar__post-list');
  if (!sidebarList) return;

  sidebarList.innerHTML = '';

  for (let i = 0; i < 3; i++) {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="sidebar__post-image">
        <div class="skeleton-sidebar-img"></div>
      </div>
      <div class="sidebar__post-content">
        <h3>
          <span class="sidebar__post-content-meta">
            <div class="skeleton-text skeleton-sidebar-meta"></div>
          </span>
          <div class="skeleton-text skeleton-sidebar-title"></div>
          <div class="skeleton-text skeleton-sidebar-title-short"></div>
        </h3>
      </div>
    `;
    sidebarList.appendChild(li);
  }
}

// ===================================
// BLOG LIST PAGE
// ===================================

async function loadBlogList() {
  try {
    const containerId = "blog-container";
    const apiUrl = "/api/blog-details/get";

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`❌ Element with ID "${containerId}" not found.`);
      return;
    }

    // ✅ Show skeleton loader
    showBlogListSkeleton(container, 6);

    const response = await fetch(apiUrl, { headers: { authorization: tkn } });
    const result = await response.json();
    blogsData = result.data?.data || [];

    const blogs = blogsData;

    // ✅ Clear skeleton and show actual content
    container.innerHTML = "";

    if (blogs.length === 0) {
      container.innerHTML = `<p class="text-center">No blogs found.</p>`;
      return;
    }

    blogs.forEach((blog, index) => {
      const date = blog.created_date
        ? new Date(blog.created_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
        : "";

      const col = document.createElement("div");
      col.className = "col-md-6 col-xl-4 wow fadeInLeft";
      col.setAttribute("data-wow-delay", `${index * 100}ms`);
      col.setAttribute("data-wow-duration", "1500ms");

      col.innerHTML = `
        <div class="blog-block-two mb-30">
          <div class="inner-box">
            <div class="image-box">
              <figure class="image">
                <img src="${encodeURI(blog?.thumbnail || '/images/blog/blog-two-image1.jpg')}"  alt="Image">
                <span class="tag">${date}</span>
              </figure>
            </div>
            <div class="content-box">
              <ul class="info">
                <li>
                  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.10742 7.625C9.38086 7.625 11.2324 9.47656 11.2324 11.75C11.2324 12.1719 10.8809 12.5 10.4824 12.5H1.48242C1.06055 12.5 0.732422 12.1719 0.732422 11.75C0.732422 9.47656 2.56055 7.625 4.85742 7.625H7.10742ZM1.85742 11.375H10.084C9.89648 9.89844 8.63086 8.75 7.10742 8.75H4.85742C3.31055 8.75 2.04492 9.89844 1.85742 11.375ZM5.98242 6.5C4.31836 6.5 2.98242 5.16406 2.98242 3.5C2.98242 1.85938 4.31836 0.5 5.98242 0.5C7.62305 0.5 8.98242 1.85938 8.98242 3.5C8.98242 5.16406 7.62305 6.5 5.98242 6.5ZM5.98242 1.625C4.92773 1.625 4.10742 2.46875 4.10742 3.5C4.10742 4.55469 4.92773 5.375 5.98242 5.375C7.01367 5.375 7.85742 4.55469 7.85742 3.5C7.85742 2.46875 7.01367 1.625 5.98242 1.625Z"
                      fill="#1A4137"
                    />
                  </svg>
                  <a href="#0">${blog.author || "Admin"}</a>
                </li>
              </ul>
              <h4 class="title">
                <a href="blog-detail.html?id=${blog.id || ""}">
                  ${blog.short_desc_list || "Untitled Blog"}
                </a>
              </h4>
              <a class="btn-one-rounded btn-onee-rounded wow fadeInLeft animated mt-30" 
                 href="blog-detail.html?id=${blog.id || ""}">
                 Read More <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      `;

      container.appendChild(col);
    });

    if (blogs.length > 0) {
      populateSidebarPosts(blogsData);
    }

  } catch (error) {
    console.error("Error loading blogs:", error);
    const container = document.getElementById("blog-container");
    if (container) {
      container.innerHTML = `<p class="text-center text-danger">Failed to load blogs.</p>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", loadBlogList);

// ===================================
// BLOG DETAIL PAGE
// ===================================

// Function to safely render blog content
function renderBlogContent(contentDiv, blog) {
  if (!contentDiv) return;

  const metaHTML = `
    <ul class="list-unstyled blog-details__meta">
      <li><a href="#"><i class="fas fa-user-circle"></i> ${blog.author || 'Admin'}</a></li>
    </ul>
  `;

  // Check if DOMPurify is available
  if (typeof DOMPurify !== 'undefined') {
    // Use DOMPurify if loaded
    const sanitizedTitle = DOMPurify.sanitize(blog.title || "Untitled Blog", { ALLOWED_TAGS: [] });
    const sanitizedContent = DOMPurify.sanitize(blog.content || blog.description || "<p>No content available.</p>");

    contentDiv.innerHTML = metaHTML + `
      <h3 class="blog-details__title">${sanitizedTitle}</h3>
      <div class="blog-content">${sanitizedContent}</div>
    `;
  } else {
    // Fallback if DOMPurify not loaded (still safe for Quill content)
    console.warn('DOMPurify not loaded, rendering without sanitization');
    const title = (blog.title || "Untitled Blog").replace(/</g, '&lt;').replace(/>/g, '&gt;');
    contentDiv.innerHTML = metaHTML + `
      <h3 class="blog-details__title">${title}</h3>
      <div class="blog-content">${blog.content || blog.description || "<p>No content available.</p>"}</div>
    `;
  }
}

async function loadBlogDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get("id");
  if (!blogId) return;

  try {
    // ✅ Show skeleton loaders
    showBlogDetailSkeleton();
    showSidebarSkeleton();

    // Fetch all blogs if not already loaded
    if (blogsData.length === 0) {
      const listRes = await fetch('/api/blog-details/get', { headers: { authorization: tkn } });
      const listResult = await listRes.json();
      blogsData = listResult.data?.data || [];
    }

    const res = await fetch(`/api/blog-details/get?id=${blogId}`, { headers: { authorization: tkn } });
    const result = await res.json();

    if (!result?.data?.data) {
      console.error("Blog not found");
      document.querySelector(".blog-details__content").innerHTML =
        "<p class='text-center text-danger'>Blog not found.</p>";
      return;
    }

    const blog = result.data.data;
    const next = result.data.next;
    const previous = result.data.previous;

    // ✅ Set main image with fallback
    const detailImg = document.querySelector(".blog-details__img");
    if (detailImg) {
      const isValidImage = blog.detail_image && blog.detail_image.match(/\.(jpeg|jpg|gif|png|webp)$/i);
      detailImg.innerHTML = `
        <img src="${isValidImage ? encodeURI(blog.detail_image) : 'https://picsum.photos/600/600'}" alt="${blog.title || 'Blog'}">
        <div class="blog-details__date">
          <span class="day">${new Date(blog.created_date).getDate().toString().padStart(2, "0")}</span>
          <span class="month">${new Date(blog.created_date).toLocaleString("en-US", { month: "short" })}</span>
        </div>
      `;
    }

    // ✅ Set title
    const titleElem = document.querySelector(".blog-details__title");
    if (titleElem) {
      titleElem.textContent = blog.title || "Untitled Blog";
      titleElem.style.display = 'block';
    }

    // ✅ Set content using the safe render function
    const contentDiv = document.querySelector(".blog-details__content");
    renderBlogContent(contentDiv, blog);

    // ✅ Set tags
    if (blog.tags && blog.tags.length > 0) {
      const tagsElem = document.querySelector(".blog-details__tags");
      if (tagsElem) {
        tagsElem.innerHTML = `<span>Tags</span> ${blog.tags.map((t) => `<a href="#">${t}</a>`).join(" ")}`;
      }
    }

    // ✅ Populate sidebar
    if (blogsData.length > 0) {
      populateSidebarPosts(blogsData, blogId);
    }

    // ✅ Set prev/next links
    const prevContainer = document.querySelector(".nav-links .prev");
    const nextContainer = document.querySelector(".nav-links .next");

    // Handle previous link
    if (!previous && prevContainer) {
      prevContainer.style.display = "none";
    } else if (previous && prevContainer) {
      const prevImg = (previous.thumbnail && previous.thumbnail.match(/\.(jpeg|jpg|gif|png|webp)$/i))
        ? previous.thumbnail
        : "images/resource/news-details.jpg";

      prevContainer.style.display = "block";
      prevContainer.innerHTML = `
        <a href="blog-detail.html?id=${previous.id}" rel="prev">
          <img src="${prevImg}" alt="Previous post" class="blog_detail_prev_next_img">
          <p class="mb-0">${previous.short_desc_list || 'Previous Post'}</p>
        </a>
      `;
    }

    // Handle next link
    if (!next && nextContainer) {
      nextContainer.style.display = "none";
    } else if (next && nextContainer) {
      const nextImg = (next.thumbnail && next.thumbnail.match(/\.(jpeg|jpg|gif|png|webp)$/i))
        ? next.thumbnail
        : "images/resource/news-details.jpg";

      nextContainer.style.display = "block";
      nextContainer.innerHTML = `
        <a href="blog-detail.html?id=${next.id}" rel="next">
          <p class="mb-0">${next.short_desc_list || 'Next Post'}</p>
          <img src="${nextImg}" alt="Next post" class="blog_detail_prev_next_img">
        </a>
      `;
    }

  } catch (err) {
    console.error("Error loading blog:", err);
    const contentDiv = document.querySelector(".blog-details__content");
    if (contentDiv) {
      contentDiv.innerHTML = "<p class='text-center text-danger'>Failed to load blog.</p>";
    }
  }
}

// Call this function when page loads
document.addEventListener('DOMContentLoaded', loadBlogDetail);

window.addEventListener("DOMContentLoaded", loadBlogDetail);

// ===================================
// SIDEBAR POSTS
// ===================================

function populateSidebarPosts(blogs, currentBlogId = null) {
  const sidebarList = document.querySelector('.sidebar__post-list');

  if (!sidebarList) {
    setTimeout(() => populateSidebarPosts(blogs, currentBlogId), 50);
    return;
  }

  sidebarList.innerHTML = '';

  const filteredBlogs = currentBlogId
    ? blogs.filter(blog => blog.id !== currentBlogId)
    : blogs;

  const latestBlogs = filteredBlogs.slice(0, 3);

  latestBlogs.forEach(blog => {
    const imgSrc = 'images/resource/blog1-1.jpg';
    const title = Array.isArray(blog.short_desc_list) ? blog.short_desc_list[0] : blog.short_desc_list || 'Untitled';
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="sidebar__post-image"><img src="${imgSrc}" alt="Blog Image"></div>
      <div class="sidebar__post-content">
        <h3>
          <span class="sidebar__post-content-meta"><i class="fas fa-user-circle"></i>${blog.author || 'Admin'}</span>
          <a href="blog-detail.html?id=${blog.id}">${title}</a>
        </h3>
      </div>
    `;
    sidebarList.appendChild(li);
  });
}



// Call this function after fetching blogs
// Example:
// const blogsData = response.data.data; // Your API response array


async function checkCurrentElement(hash) {
  switch (hash) {
    case "#BannerDetails":
      selectFirstElement();
      break;
    case "#chartDetails":
      loadChartData();
      break;
    case "#TableDetails":
      loadTableData();
      break;
    case "#EnquiryList":
      break;
    case "#BlogList":
      loadBlogData();
      break;
    default:
      selectFirstElement()
      break;
  }
}




// const datePicker = document.getElementById("datePicker");
// const dateInput = document.getElementById("dateInput");

// dateInput.addEventListener("paste", (e) => {
//   e.preventDefault();
//   const text = (e.clipboardData || window.clipboardData).getData("text").trim();
//   const parsedDate = new Date(text);
//   if (!isNaN(parsedDate)) {
//     const formatted = formatDate(parsedDate);
//     dateInput.value = formatted;
//     // Sync datePicker too (for visual consistency)
//     datePicker.value = toISO(parsedDate);
//   } else {
//     dateInput.value = text;
//   }
// });

// datePicker.addEventListener("change", () => {
//   if (datePicker.value) {
//     const d = new Date(datePicker.value);
//     dateInput.value = formatDate(d);
//   }
// });

const initDateHandlers = () => {
  const datePicker = document.getElementById("datePicker");
  const dateInput = document.getElementById("dateInput");

  if (!datePicker || !dateInput) return false; // not ready yet

  // ✅ Handle paste inside text input
  dateInput.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text").trim();
    const parsedDate = new Date(text);

    if (!isNaN(parsedDate)) {
      const formatted = formatDate(parsedDate);
      dateInput.value = formatted;
      // Sync datePicker too
      datePicker.value = toISO(parsedDate);
    } else {
      dateInput.value = text;
    }
  });

  // ✅ Handle change when picking from date picker
  datePicker.addEventListener("change", () => {
    if (datePicker.value) {
      const d = new Date(datePicker.value);
      dateInput.value = formatDate(d);
    }
  });

  return true;
};

// 🔁 Keep checking every 300ms until elements exist
const dateInitInterval = setInterval(() => {
  if (initDateHandlers()) {
    clearInterval(dateInitInterval); // stop checking once initialized
  }
}, 300);

// ✅ Helper functions
// function formatDate(date) {
//   return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
// }

// function toISO(date) {
//   return date.toISOString().split("T")[0]; // YYYY-MM-DD
// }


// Helper: convert Date → DD-MM-YYYY
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Helper: convert Date → YYYY-MM-DD (for <input type="date">)
function toISO(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}