document.addEventListener("DOMContentLoaded", () => {
    // =========================================
    // Credenciais e Chaves de Armazenamento
    // =========================================
    const AUTH_USER = "adminnucre";
    const AUTH_PASS = "1234";
    const STORAGE_KEY = "nucre_site_content";
    const LEGACY_STORAGE_KEY = "nucre_cms_data";
    const SESSION_KEY = "nucre_admin_auth";

    // Elementos da Interface
    const loginScreen = document.getElementById("admin-login-screen");
    const dashboardScreen = document.getElementById("admin-dashboard-screen");
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");

    const iframe = document.getElementById("cms-visual-iframe");
    const viewportWrapper = document.getElementById("admin-viewport-wrapper");
    const pageButtons = document.querySelectorAll(".admin-page-btn");
    const deviceButtons = document.querySelectorAll(".admin-device-switcher button");
    const btnSave = document.getElementById("btn-save-cms");
    const btnSaveText = document.getElementById("btn-save-text");
    const btnLogout = document.getElementById("btn-logout");
    const btnResetDefault = document.getElementById("btn-reset-default");
    const btnExportJson = document.getElementById("btn-export-json");
    const inputImportJson = document.getElementById("input-import-json");
    const btnOpenLiveSite = document.getElementById("btn-open-live-site");
    const toast = document.getElementById("admin-toast");

    // Modal de Troca de Imagem
    const imgModal = document.getElementById("admin-img-modal");
    const imgModalClose = document.getElementById("admin-img-modal-close");
    const btnCancelImg = document.getElementById("btn-cancel-img");
    const btnApplyImg = document.getElementById("btn-apply-img");
    const uploadZone = document.getElementById("admin-upload-zone");
    const modalFileInput = document.getElementById("admin-modal-file-input");
    const modalUrlInput = document.getElementById("admin-modal-url-input");
    const modalPreviewImg = document.getElementById("admin-modal-preview-img");

    // Estado do Editor
    let isDirty = false;
    let dirtyCount = 0;
    let siteData = loadStoredData();
    let currentTargetImgElement = null;
    let currentTargetImgKey = null;
    let currentSelectedImgData = null;

    // =========================================
    // Controle de Sessão e Login
    // =========================================
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
        showStudio();
    } else {
        showLogin();
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const user = document.getElementById("admin-user").value.trim();
            const pass = document.getElementById("admin-pass").value.trim();

            if (user === AUTH_USER && pass === AUTH_PASS) {
                sessionStorage.setItem(SESSION_KEY, "true");
                if (loginError) loginError.style.display = "none";
                showStudio();
            } else {
                if (loginError) {
                    loginError.style.display = "block";
                    loginError.textContent = "Usuário ou senha incorretos!";
                }
            }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            if (isDirty) {
                if (!confirm("Você tem alterações não salvas. Deseja realmente sair sem salvar?")) {
                    return;
                }
            }
            sessionStorage.removeItem(SESSION_KEY);
            showLogin();
        });
    }

    function showLogin() {
        if (loginScreen) loginScreen.style.display = "flex";
        if (dashboardScreen) dashboardScreen.style.display = "none";
    }

    function showStudio() {
        if (loginScreen) loginScreen.style.display = "none";
        if (dashboardScreen) dashboardScreen.style.display = "flex";
        updateLiveSiteLink();
    }

    // =========================================
    // Navegação entre Páginas e Sincronização
    // =========================================
    function setupNavButtons() {
        const navElements = document.querySelectorAll(".admin-page-btn, .admin-dropdown-item");
        navElements.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const page = btn.getAttribute("data-page");
                if (page) {
                    navigateToPage(page);
                }
            });
        });
    }
    setupNavButtons();

    function navigateToPage(pageTarget) {
        if (!pageTarget) return;

        const parts = pageTarget.split('#');
        const targetBase = parts[0] || "index.html";
        const targetHash = parts[1] ? '#' + parts[1] : '';

        // Atualiza estado ativo dos botões no menu
        const allNavElements = document.querySelectorAll(".admin-page-btn, .admin-dropdown-item");
        allNavElements.forEach(b => {
            const bPage = b.getAttribute("data-page");
            if (bPage === pageTarget || (!targetHash && bPage === targetBase)) {
                b.classList.add("active");
            } else {
                b.classList.remove("active");
            }
        });

        if (iframe && iframe.contentWindow) {
            const currentBase = getCurrentIframePage();
            if (currentBase === targetBase) {
                // Já está na mesma página base (ex: servicos.html), altera apenas o hash
                if (iframe.contentWindow.location.hash !== targetHash) {
                    iframe.contentWindow.location.hash = targetHash;
                } else {
                    iframe.contentWindow.dispatchEvent(new Event('hashchange'));
                }
                setTimeout(() => {
                    setupIframeEditor();
                }, 150);
            } else {
                iframe.src = pageTarget;
            }
        } else if (iframe) {
            iframe.src = pageTarget;
        }

        updateLiveSiteLink(pageTarget);
    }

    function updateLiveSiteLink(page = null) {
        if (!btnOpenLiveSite) return;
        const currentPage = page || getCurrentIframeFullUrl();
        btnOpenLiveSite.href = currentPage;
    }

    function getCurrentIframePage() {
        if (!iframe || !iframe.contentWindow) return "index.html";
        try {
            const path = iframe.contentWindow.location.pathname;
            const filename = path.substring(path.lastIndexOf('/') + 1);
            return filename || "index.html";
        } catch (e) {
            return "index.html";
        }
    }

    function getCurrentIframeFullUrl() {
        if (!iframe || !iframe.contentWindow) return "index.html";
        try {
            const path = iframe.contentWindow.location.pathname;
            const filename = path.substring(path.lastIndexOf('/') + 1) || "index.html";
            const hash = iframe.contentWindow.location.hash || "";
            return filename + hash;
        } catch (e) {
            return "index.html";
        }
    }

    // =========================================
    // Alternância de Dispositivo (Desktop / Tablet / Mobile)
    // =========================================
    deviceButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const device = btn.getAttribute("data-device");
            deviceButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (viewportWrapper) {
                viewportWrapper.classList.remove("desktop-view", "tablet-view", "mobile-view");
                if (device === "mobile") {
                    viewportWrapper.classList.add("mobile-view");
                } else if (device === "tablet") {
                    viewportWrapper.classList.add("tablet-view");
                } else {
                    viewportWrapper.classList.add("desktop-view");
                }
            }
        });
    });

    // =========================================
    // Motor de Injeção de Edição In-Place no iFrame
    // =========================================
    if (iframe) {
        iframe.addEventListener("load", () => {
            setupIframeEditor();
            
            // Ouve mudanças de hash dentro do iframe
            try {
                if (iframe.contentWindow) {
                    iframe.contentWindow.addEventListener("hashchange", () => {
                        setTimeout(() => {
                            setupIframeEditor();
                        }, 100);
                    });
                }
            } catch(e) {}
        });
    }

    function setupIframeEditor() {
        try {
            const iDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (!iDoc) return;

            const fullPageUrl = getCurrentIframeFullUrl();
            const basePage = getCurrentIframePage();
            
            // Sincroniza o botão ativo do cabeçalho
            const allNavElements = document.querySelectorAll(".admin-page-btn, .admin-dropdown-item");
            allNavElements.forEach(b => {
                const bPage = b.getAttribute("data-page");
                if (bPage === fullPageUrl || bPage === basePage) {
                    b.classList.add("active");
                } else {
                    b.classList.remove("active");
                }
            });
            updateLiveSiteLink(fullPageUrl);

            // Injeta folha de estilos do editor dentro do iFrame
            injectEditorStyles(iDoc);

            // Aplica as alterações já salvas na página
            applySavedOverridesToDoc(iDoc, basePage);

            // Adiciona manipuladores aos elementos editáveis e intercepta navegação
            attachInPlaceListeners(iDoc, basePage);

        } catch (err) {
            console.error("Erro ao inicializar o editor no iFrame:", err);
        }
    }

    function injectEditorStyles(doc) {
        if (doc.getElementById("nucre-visual-cms-injected-styles")) return;

        const style = doc.createElement("style");
        style.id = "nucre-visual-cms-injected-styles";
        style.innerHTML = `
            .nucre-cms-hover-text {
                outline: 2px dashed #0284c7 !important;
                outline-offset: 3px !important;
                cursor: text !important;
                position: relative !important;
            }
            .nucre-cms-hover-img {
                outline: 3px dashed #06b6d4 !important;
                outline-offset: 4px !important;
                cursor: pointer !important;
                filter: brightness(0.92) !important;
                position: relative !important;
            }
            .nucre-cms-editing {
                outline: 3px solid #2563eb !important;
                outline-offset: 4px !important;
                box-shadow: 0 0 25px rgba(37, 99, 235, 0.4) !important;
                background-color: rgba(238, 242, 255, 0.96) !important;
                color: #0f172a !important;
                border-radius: 4px !important;
            }
            .nucre-cms-locked-hover {
                cursor: not-allowed !important;
            }
        `;
        doc.head.appendChild(style);
    }

    // =========================================
    // Gerador de Chaves Determinísticas por Elemento
    // =========================================
    function getElementKey(el, doc) {
        if (el.getAttribute("data-cms-key")) {
            return el.getAttribute("data-cms-key");
        }
        if (el.id) {
            return "#" + el.id;
        }

        // Gera seletor de caminho único (DOM path)
        const parts = [];
        let curr = el;
        while (curr && curr !== doc.body && curr !== doc.documentElement) {
            let tag = curr.tagName.toLowerCase();
            let index = 1;
            let sibling = curr.previousElementSibling;
            while (sibling) {
                if (sibling.tagName.toLowerCase() === tag) {
                    index++;
                }
                sibling = sibling.previousElementSibling;
            }
            let part = tag + ":nth-of-type(" + index + ")";
            if (curr.className && typeof curr.className === "string") {
                const mainClass = curr.className.split(" ")
                    .filter(c => c && !c.startsWith("nucre-") && !c.startsWith("active") && !c.startsWith("fade") && !c.startsWith("reveal"))[0];
                if (mainClass) part += "." + mainClass;
            }
            parts.unshift(part);
            curr = curr.parentElement;
        }
        return parts.join(" > ");
    }

    // =========================================
    // Anexar Ouvintes de Duplo Clique (Textos e Imagens)
    // =========================================
    function attachInPlaceListeners(doc, currentPage) {
        const currentHash = doc.defaultView ? doc.defaultView.location.hash.replace('#', '') : '';

        // 1. Bloqueia Header e Footer e intercepta links para navegação contínua no editor
        const lockedHeaders = doc.querySelectorAll("header, .main-header, footer, .main-footer");
        lockedHeaders.forEach(locked => {
            locked.addEventListener("mouseenter", () => {
                locked.classList.add("nucre-cms-locked-hover");
            });
            locked.addEventListener("mouseleave", () => {
                locked.classList.remove("nucre-cms-locked-hover");
            });

            const links = locked.querySelectorAll("a[href]");
            links.forEach(a => {
                a.addEventListener("click", (e) => {
                    const href = a.getAttribute("href");
                    if (href && !href.startsWith("javascript") && !href.startsWith("http") && !href.startsWith("mailto") && !href.startsWith("tel")) {
                        e.preventDefault();
                        navigateToPage(href);
                    }
                });
            });
        });

        // 2. Intercepta botões de voltar e cards de serviços
        const internalNavLinks = doc.querySelectorAll("#back-btn, .card-arrow-btn, .service-card a");
        internalNavLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (href) {
                    e.preventDefault();
                    if (href === "#" || href === "") {
                        if (doc.defaultView) doc.defaultView.location.hash = "";
                    } else if (href.startsWith("#")) {
                        if (doc.defaultView) doc.defaultView.location.hash = href;
                    } else {
                        navigateToPage(href);
                    }
                    setTimeout(() => { setupIframeEditor(); }, 100);
                }
            });
        });

        // 3. Elementos de Texto Editáveis (Fora do Header e Footer)
        const textSelectors = "h1, h2, h3, h4, h5, h6, p, .subtitle, .stat-number, .stat-label, span, li, button:not(.mobile-menu-toggle), .btn, strong, em, b";
        const allTextElements = doc.body.querySelectorAll(textSelectors);

        allTextElements.forEach(el => {
            // Ignora se estiver dentro de header ou footer
            if (el.closest("header, .main-header, footer, .main-footer")) return;
            // Ignora botão de voltar do serviço ou ícones
            if (el.id === "back-btn" || el.closest("#back-btn") || el.classList.contains("faq-icon") || el.closest(".hero-slider-dots, .marquee-group, script, style")) return;
            // Se contiver elementos filhos com outros blocos de texto maiores, foca nos nós folha
            if (el.querySelector("h1, h2, h3, h4, h5, h6, p, div.feature-item, div.service-card")) return;

            // Hover Efeitos
            el.addEventListener("mouseenter", () => {
                if (!el.isContentEditable) {
                    el.classList.add("nucre-cms-hover-text");
                }
            });
            el.addEventListener("mouseleave", () => {
                el.classList.remove("nucre-cms-hover-text");
            });

            // Duplo Clique para Editar Texto
            el.addEventListener("dblclick", (e) => {
                e.preventDefault();
                e.stopPropagation();

                el.classList.remove("nucre-cms-hover-text");
                el.classList.add("nucre-cms-editing");
                el.contentEditable = "true";
                el.focus();

                const originalText = el.innerHTML;

                function finishEdit() {
                    el.contentEditable = "false";
                    el.classList.remove("nucre-cms-editing");
                    el.removeEventListener("blur", finishEdit);
                    el.removeEventListener("keydown", handleKey);

                    const newText = el.innerHTML.trim();
                    if (newText !== originalText) {
                        const key = getElementKey(el, doc);
                        
                        // Se estivermos dentro da página interna de um serviço específico
                        if (currentHash) {
                            registerServiceDetailChange(currentHash, el, newText, key, currentPage);
                        } else {
                            registerPageTextChange(currentPage, key, newText);
                        }
                        markDirty();
                    }
                }

                function handleKey(ev) {
                    if (ev.key === "Escape") {
                        el.innerHTML = originalText;
                        el.blur();
                    } else if (ev.key === "Enter" && !ev.shiftKey && (el.tagName.startsWith("H") || el.tagName === "BUTTON" || el.classList.contains("btn"))) {
                        ev.preventDefault();
                        el.blur();
                    }
                }

                el.addEventListener("blur", finishEdit);
                el.addEventListener("keydown", handleKey);
            });
        });

        // 4. Imagens e Background-Images Editáveis (Fora do Header e Footer)
        const images = doc.body.querySelectorAll("img, .service-card, .featured-team-img, .home-care-image");
        images.forEach(imgEl => {
            if (imgEl.closest("header, .main-header, footer, .main-footer")) return;

            imgEl.addEventListener("mouseenter", () => {
                imgEl.classList.add("nucre-cms-hover-img");
            });
            imgEl.addEventListener("mouseleave", () => {
                imgEl.classList.remove("nucre-cms-hover-img");
            });

            // Duplo clique para trocar imagem
            imgEl.addEventListener("dblclick", (e) => {
                e.preventDefault();
                e.stopPropagation();

                const key = getElementKey(imgEl, doc);
                let currentSrc = "";
                if (imgEl.tagName.toLowerCase() === "img") {
                    currentSrc = imgEl.src;
                } else {
                    const bg = imgEl.style.backgroundImage || window.getComputedStyle(imgEl).backgroundImage;
                    currentSrc = bg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
                }

                openImageModal(imgEl, key, currentSrc, currentPage, currentHash);
            });
        });
    }

    // Registro específico de alterações em páginas internas de serviços
    function registerServiceDetailChange(serviceId, el, newText, genericKey, currentPage) {
        if (!siteData.servicesDetails) siteData.servicesDetails = {};
        if (!siteData.servicesDetails[serviceId]) siteData.servicesDetails[serviceId] = {};

        const sDetails = siteData.servicesDetails[serviceId];

        if (el.id === "detail-title") {
            sDetails.title = newText;
        } else if (el.id === "detail-description") {
            sDetails.description = newText;
        } else if (el.hasAttribute("data-benefit-index")) {
            const bIdx = parseInt(el.getAttribute("data-benefit-index"), 10);
            if (!sDetails.benefits) sDetails.benefits = [];
            sDetails.benefits[bIdx] = newText;
        } else if (el.closest(".faq-item")) {
            const faqItem = el.closest(".faq-item");
            const fIdx = parseInt(faqItem.getAttribute("data-faq-index") || "0", 10);
            if (!sDetails.faqs) sDetails.faqs = [];
            if (!sDetails.faqs[fIdx]) sDetails.faqs[fIdx] = { q: "", a: "" };

            if (el.classList.contains("faq-question-text") || el.closest(".faq-question")) {
                sDetails.faqs[fIdx].q = newText;
            } else if (el.classList.contains("faq-answer-text") || el.closest(".faq-answer")) {
                sDetails.faqs[fIdx].a = newText;
            }
        }

        // Também salva de forma genérica para garantir sincronia
        registerPageTextChange(currentPage + "#" + serviceId, genericKey, newText);
    }

    // =========================================
    // Modal de Troca de Imagem
    // =========================================
    function openImageModal(el, key, currentSrc, page, serviceHash = "") {
        currentTargetImgElement = el;
        currentTargetImgKey = key;
        currentSelectedImgData = currentSrc;
        currentTargetImgElement._serviceHash = serviceHash;

        if (modalPreviewImg) modalPreviewImg.src = currentSrc || "";
        if (modalUrlInput) modalUrlInput.value = currentSrc && !currentSrc.startsWith("data:") ? currentSrc : "";
        if (modalFileInput) modalFileInput.value = "";

        if (imgModal) imgModal.classList.add("active");
    }

    function closeImageModal() {
        if (imgModal) imgModal.classList.remove("active");
        currentTargetImgElement = null;
        currentTargetImgKey = null;
        currentSelectedImgData = null;
    }

    if (imgModalClose) imgModalClose.addEventListener("click", closeImageModal);
    if (btnCancelImg) btnCancelImg.addEventListener("click", closeImageModal);

    // Clique na zona de upload dispara o input de arquivo
    if (uploadZone && modalFileInput) {
        uploadZone.addEventListener("click", () => {
            modalFileInput.click();
        });

        // Drag & Drop
        uploadZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            uploadZone.classList.add("dragover");
        });
        uploadZone.addEventListener("dragleave", () => {
            uploadZone.classList.remove("dragover");
        });
        uploadZone.addEventListener("drop", (e) => {
            e.preventDefault();
            uploadZone.classList.remove("dragover");
            const file = e.dataTransfer.files[0];
            if (file) handleImageFile(file);
        });
    }

    if (modalFileInput) {
        modalFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) handleImageFile(file);
        });
    }

    function handleImageFile(file) {
        if (!file.type.startsWith("image/")) {
            alert("Por favor selecione um arquivo de imagem válido.");
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            alert("A imagem selecionada é maior que 4MB. Por favor escolha uma imagem menor.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            currentSelectedImgData = base64;
            if (modalPreviewImg) modalPreviewImg.src = base64;
            if (modalUrlInput) modalUrlInput.value = "";
        };
        reader.readAsDataURL(file);
    }

    if (modalUrlInput) {
        modalUrlInput.addEventListener("input", (e) => {
            const url = e.target.value.trim();
            if (url) {
                currentSelectedImgData = url;
                if (modalPreviewImg) modalPreviewImg.src = url;
            }
        });
    }

    // Aplicar a nova imagem
    if (btnApplyImg) {
        btnApplyImg.addEventListener("click", () => {
            if (!currentTargetImgElement || !currentSelectedImgData) {
                closeImageModal();
                return;
            }

            const currentPage = getCurrentIframePage();
            const el = currentTargetImgElement;

            if (el.tagName && el.tagName.toLowerCase() === "img") {
                el.src = currentSelectedImgData;
            } else {
                el.style.backgroundImage = `url('${currentSelectedImgData}')`;
            }

            if (el._serviceHash) {
                if (!siteData.servicesDetails) siteData.servicesDetails = {};
                if (!siteData.servicesDetails[el._serviceHash]) siteData.servicesDetails[el._serviceHash] = {};
                siteData.servicesDetails[el._serviceHash].image = currentSelectedImgData;
                registerPageImageChange(currentPage + "#" + el._serviceHash, currentTargetImgKey, currentSelectedImgData);
            }

            registerPageImageChange(currentPage, currentTargetImgKey, currentSelectedImgData);
            markDirty();
            closeImageModal();
            showToast("Imagem atualizada com sucesso no preview!");
        });
    }

    // =========================================
    // Gerenciamento de Estado e Registro de Alterações
    // =========================================
    function registerPageTextChange(page, key, text) {
        if (!siteData.pages) siteData.pages = {};
        if (!siteData.pages[page]) siteData.pages[page] = { texts: {}, images: {} };
        if (!siteData.pages[page].texts) siteData.pages[page].texts = {};

        siteData.pages[page].texts[key] = text;
    }

    function registerPageImageChange(page, key, imgSrc) {
        if (!siteData.pages) siteData.pages = {};
        if (!siteData.pages[page]) siteData.pages[page] = { texts: {}, images: {} };
        if (!siteData.pages[page].images) siteData.pages[page].images = {};

        siteData.pages[page].images[key] = imgSrc;
    }

    function applySavedOverridesToDoc(doc, page) {
        if (!siteData) return;

        const currentHash = doc.defaultView ? doc.defaultView.location.hash.replace('#', '') : '';
        const fullPageKey = page + (currentHash ? '#' + currentHash : '');

        // 1. Aplica dados de páginas internas de serviços
        if (currentHash && siteData.servicesDetails && siteData.servicesDetails[currentHash]) {
            const sData = siteData.servicesDetails[currentHash];
            const titleEl = doc.getElementById('detail-title');
            const descEl = doc.getElementById('detail-description');
            const imgEl = doc.getElementById('detail-image');

            if (titleEl && sData.title) titleEl.innerHTML = sData.title;
            if (descEl && sData.description) descEl.innerHTML = sData.description;
            if (imgEl && sData.image) imgEl.src = sData.image;

            if (sData.benefits && Array.isArray(sData.benefits)) {
                const benefitsList = doc.getElementById('detail-benefits');
                if (benefitsList) {
                    sData.benefits.forEach((ben, bIdx) => {
                        const li = benefitsList.querySelector(`li[data-benefit-index="${bIdx}"]`) || benefitsList.children[bIdx];
                        if (li && ben) li.innerHTML = ben;
                    });
                }
            }

            if (sData.faqs && Array.isArray(sData.faqs)) {
                const faqsContainer = doc.getElementById('detail-faqs');
                if (faqsContainer) {
                    sData.faqs.forEach((faq, fIdx) => {
                        const faqItem = faqsContainer.querySelector(`.faq-item[data-faq-index="${fIdx}"]`) || faqsContainer.children[fIdx];
                        if (faqItem && faq) {
                            const qEl = faqItem.querySelector('.faq-question-text');
                            const aEl = faqItem.querySelector('.faq-answer-text');
                            if (qEl && faq.q) qEl.innerHTML = faq.q;
                            if (aEl && faq.a) aEl.innerHTML = faq.a;
                        }
                    });
                }
            }
        }

        // 2. Aplica overrides genéricos da página base e da página com hash
        [page, fullPageKey].forEach(targetKey => {
            if (siteData.pages && siteData.pages[targetKey]) {
                const pageData = siteData.pages[targetKey];
                if (pageData.texts) {
                    Object.keys(pageData.texts).forEach(key => {
                        const val = pageData.texts[key];
                        try {
                            let el = null;
                            if (key.startsWith("#")) {
                                el = doc.getElementById(key.slice(1));
                            } else if (key.startsWith("data-cms-key=")) {
                                el = doc.querySelector(`[data-cms-key="${key.split('=')[1]}"]`);
                            } else {
                                el = doc.querySelector(key);
                            }
                            if (el && !el.closest("header, .main-header, footer, .main-footer")) {
                                el.innerHTML = val;
                            }
                        } catch (e) {}
                    });
                }

                if (pageData.images) {
                    Object.keys(pageData.images).forEach(key => {
                        const val = pageData.images[key];
                        try {
                            let el = null;
                            if (key.startsWith("#")) {
                                el = doc.getElementById(key.slice(1));
                            } else if (key.startsWith("data-cms-key=")) {
                                el = doc.querySelector(`[data-cms-key="${key.split('=')[1]}"]`);
                            } else {
                                el = doc.querySelector(key);
                            }
                            if (el && !el.closest("header, .main-header, footer, .main-footer")) {
                                if (el.tagName && el.tagName.toLowerCase() === "img") {
                                    el.src = val;
                                } else {
                                    el.style.backgroundImage = `url('${val}')`;
                                }
                            }
                        } catch (e) {}
                    });
                }
            }
        });

        // Sanitiza títulos de pilares contra prefixos antigos
        doc.querySelectorAll(".features-grid .feature-item h3").forEach(h3 => {
            if (h3) {
                h3.textContent = h3.textContent.replace(/^[0-9]+\)\s*/, '');
            }
        });
    }

    function markDirty() {
        isDirty = true;
        dirtyCount++;
        if (btnSave) {
            btnSave.classList.add("has-changes");
            if (btnSaveText) btnSaveText.textContent = `Salvar Alterações (${dirtyCount})`;
        }
    }

    function clearDirty() {
        isDirty = false;
        dirtyCount = 0;
        if (btnSave) {
            btnSave.classList.remove("has-changes");
            if (btnSaveText) btnSaveText.textContent = "Salvar Alterações";
        }
    }

    // =========================================
    // Salvar, Exportar, Importar e Resetar
    // =========================================
    if (btnSave) {
        btnSave.addEventListener("click", () => {
            saveChanges();
        });
    }

    function saveChanges() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
            // Sincroniza também para compatibilidade
            localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(siteData));
            clearDirty();
            showToast("Alterações salvas com sucesso! O site público está atualizado.");
        } catch (e) {
            alert("Erro ao salvar dados no armazenamento local: " + e.message);
        }
    }

    // Exportar JSON
    if (btnExportJson) {
        btnExportJson.addEventListener("click", () => {
            const jsonStr = JSON.stringify(siteData, null, 2);
            const blob = new Blob([jsonStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement("a");
            a.href = url;
            a.download = `nucre-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast("Backup JSON gerado e baixado com sucesso!");
        });
    }

    // Importar JSON
    if (inputImportJson) {
        inputImportJson.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    if (imported && typeof imported === "object") {
                        siteData = imported;
                        saveChanges();
                        if (iframe) iframe.src = iframe.src; // recarrega página
                        showToast("Backup JSON restaurado com sucesso!");
                    } else {
                        alert("O arquivo JSON selecionado não é válido.");
                    }
                } catch(err) {
                    alert("Erro ao importar o arquivo JSON: " + err.message);
                }
            };
            reader.readAsText(file);
        });
    }

    // Resetar Padrão
    if (btnResetDefault) {
        btnResetDefault.addEventListener("click", () => {
            if (confirm("Deseja mesmo restaurar todos os conteúdos para o padrão original da clínica? Todas as edições serão desfeitas.")) {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(LEGACY_STORAGE_KEY);
                siteData = { pages: {}, servicesDetails: {} };
                clearDirty();
                if (iframe) iframe.src = iframe.src;
                showToast("Conteúdos restaurados para os padrões originais!");
            }
        });
    }

    // Carregar Dados Salvos
    function loadStoredData() {
        const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object") {
                    if (!parsed.pages) parsed.pages = {};
                    if (!parsed.servicesDetails) parsed.servicesDetails = {};
                    return parsed;
                }
            } catch (e) {}
        }
        return { pages: {}, servicesDetails: {} };
    }

    // Toast Notificação
    function showToast(msg) {
        if (!toast) return;
        toast.innerHTML = `<span>${msg}</span>`;
        toast.classList.add("active");
        setTimeout(() => {
            toast.classList.remove("active");
        }, 3500);
    }
});
