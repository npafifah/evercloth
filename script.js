document.addEventListener("DOMContentLoaded", function () {
  const filterSelect = document.getElementById("kategori");
  const produkGrid = document.getElementById("produkGrid");
  const produkCards = Array.from(document.querySelectorAll(".produk-card"));
  const pagination = document.getElementById("pagination");
  const produkPerPage = 12;
  let filteredProduk = produkCards.slice();
  let currentPage = 1;

  const urlParams = new URLSearchParams(window.location.search);
  const kategoriDariURL = urlParams.get("kategori");

  if (kategoriDariURL && filterSelect) {
    filterSelect.value = kategoriDariURL;
  }

  function showPage(page) {
    currentPage = page;
    produkCards.forEach(card => card.style.display = "none");
    let start = (page - 1) * produkPerPage;
    let end = start + produkPerPage;
    filteredProduk.slice(start, end).forEach(card => card.style.display = "block");
    updatePagination();
  }

  function updatePagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(filteredProduk.length / produkPerPage);
    if (totalPages === 0) {
      pagination.style.display = "none";
      return;
    } else {
      pagination.style.display = "block";
    }

    const prev = document.createElement("a");
    prev.href = "#";
    prev.textContent = "«";
    prev.classList.toggle("disabled", currentPage === 1);
    prev.style.pointerEvents = currentPage === 1 ? "none" : "auto";
    prev.addEventListener("click", e => {
      e.preventDefault();
      if (currentPage > 1) showPage(currentPage - 1);
    });
    pagination.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = i;
      a.classList.toggle("active", i === currentPage);
      a.addEventListener("click", e => {
        e.preventDefault();
        showPage(i);
      });
      pagination.appendChild(a);
    }

    const next = document.createElement("a");
    next.href = "#";
    next.textContent = "»";
    next.classList.toggle("disabled", currentPage === totalPages);
    next.style.pointerEvents = currentPage === totalPages ? "none" : "auto";
    next.addEventListener("click", e => {
      e.preventDefault();
      if (currentPage < totalPages) showPage(currentPage + 1);
    });
    pagination.appendChild(next);
  }

  function filterProduk() {
    const selectedKategori = filterSelect?.value;
    if (selectedKategori === "semua") {
      filteredProduk = produkCards.slice();
    } else {
      filteredProduk = produkCards.filter(card => card.getAttribute("data-kategori") === selectedKategori);
    }
    showPage(1);
  }

  if (filterSelect) {
    filterSelect.addEventListener("change", filterProduk);
    filterProduk(); 
  }

  window.validasiForm = function () {
    const nama = document.getElementById("nama")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const pesan = document.getElementById("pesan")?.value.trim();

    if (!nama || !email || !pesan) {
      alert("Semua kolom harus diisi!");
      return false;
    }

    alert("Terima kasih! Pesan Anda telah terkirim.");
    return true;
  };

  const hapusButtons = document.querySelectorAll(".btn-hapus");

  hapusButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const row = btn.closest("tr");
      if (row) row.remove();
      updateTotal();
    });
  });

  function updateTotal() {
    const rows = document.querySelectorAll(".cart-table tbody tr");
    let total = 0;

    rows.forEach(function (row) {
      const hargaText = row.children[1].textContent.replace(/[^\d]/g, "");
      const jumlah = parseInt(row.querySelector("input[type='number']").value);
      const harga = parseInt(hargaText);
      total += harga * jumlah;
    });

    const totalDisplay = document.querySelector(".cart-summary p");
    if (totalDisplay) {
      totalDisplay.innerHTML = `<strong>Total Belanja:</strong> Rp${total.toLocaleString("id-ID")}`;
    }
  }

  const jumlahKeranjang = localStorage.getItem("jumlahKeranjang") || 3;
  const badge = document.querySelector(".cart-badge");
  if (badge) {
    badge.textContent = jumlahKeranjang;
  }

  const newsletterForm = document.getElementById("newsletter-form");
  const message = document.getElementById("newsletter-message");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      message.textContent = "✅ Terima kasih telah berlangganan!";
      message.style.color = "#2e7d32";
      message.style.marginTop = "1rem";
      message.style.display = "block";
      newsletterForm.reset();

      setTimeout(() => {
        message.style.display = "none";
      }, 4000);
    });
  }
});

 document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const produkCards = document.querySelectorAll(".produk-card");

    searchInput.addEventListener("input", function () {
      const query = searchInput.value.toLowerCase();

      produkCards.forEach(function (card) {
        const namaProduk = card.querySelector("h3").textContent.toLowerCase();
        if (namaProduk.includes(query)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
  const tbody = document.querySelector(".cart-table tbody");
  const totalDisplay = document.querySelector(".cart-summary p");
  let total = 0;
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  if (keranjang.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5'>Keranjang masih kosong.</td></tr>";
    totalDisplay.innerHTML = `<strong>Total Belanja:</strong> Rp0`;
    return;
  }

  tbody.innerHTML = ""; 

  keranjang.forEach((item, index) => {
    const hargaAngka = parseInt(item.harga.replace(/[^\d]/g, ""));
    const totalItem = hargaAngka * item.jumlah;
    total += totalItem;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nama}</td>
      <td>${item.harga}</td>
      <td><input type="number" value="${item.jumlah}" min="1" data-index="${index}" /></td>
      <td>Rp${totalItem.toLocaleString("id-ID")}</td>
      <td><button class="btn-hapus" data-index="${index}">Hapus</button></td>
    `;
    tbody.appendChild(tr);
  });

  totalDisplay.innerHTML = `<strong>Total Belanja:</strong> Rp${total.toLocaleString("id-ID")}`;

  tbody.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("input", function () {
      const i = this.dataset.index;
      keranjang[i].jumlah = parseInt(this.value);
      localStorage.setItem("keranjang", JSON.stringify(keranjang));
      location.reload(); 
    });
  });

  tbody.querySelectorAll(".btn-hapus").forEach(btn => {
    btn.addEventListener("click", function () {
      const i = this.dataset.index;
      keranjang.splice(i, 1);
      localStorage.setItem("keranjang", JSON.stringify(keranjang));
      location.reload();
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
    const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
    const badge = document.querySelector(".cart-badge");
    if (badge) {
      const totalJumlah = keranjang.reduce((sum, item) => sum + (item.jumlah || 1), 0);
      badge.textContent = totalJumlah > 0 ? totalJumlah : "";
    }
  });