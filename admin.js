document.addEventListener("DOMContentLoaded", () => {
    // Credenciais e Chaves de Armazenamento
    const AUTH_USER = "adminnucre";
    const AUTH_PASS = "1234";
    const STORAGE_KEY = "nucre_cms_data";
    const SESSION_KEY = "nucre_admin_auth";

    const loginScreen = document.getElementById("admin-login-screen");
    const dashboardScreen = document.getElementById("admin-dashboard-screen");
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");

    const cmsForm = document.getElementById("cms-form");
    const btnLogout = document.getElementById("btn-logout");
    const btnResetDefault = document.getElementById("btn-reset-default");
    const btnTogglePreview = document.getElementById("btn-toggle-preview");
    const btnExportJson = document.getElementById("btn-export-json");
    const inputImportJson = document.getElementById("input-import-json");
    const adminSearchInput = document.getElementById("admin-search-input");
    const unsavedBadge = document.getElementById("unsaved-badge");
    const adminToast = document.getElementById("admin-toast");
    const previewCol = document.getElementById("admin-preview-col");

    let isDirty = false;
    let dirtyCount = 0;

    // Autenticação de Sessão
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
        showDashboard();
    } else {
        showLogin();
    }

    // Formulário de Login
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const user = document.getElementById("admin-user").value.trim();
            const pass = document.getElementById("admin-pass").value.trim();

            if (user === AUTH_USER && pass === AUTH_PASS) {
                sessionStorage.setItem(SESSION_KEY, "true");
                if (loginError) loginError.style.display = "none";
                showDashboard();
            } else {
                if (loginError) {
                    loginError.style.display = "block";
                    loginError.textContent = "Usuário ou senha incorretos!";
                }
            }
        });
    }

    // Logout
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            sessionStorage.removeItem(SESSION_KEY);
            showLogin();
        });
    }

    // Alternar Visualização da Prévia ao Vivo
    if (btnTogglePreview && previewCol) {
        btnTogglePreview.addEventListener("click", () => {
            previewCol.classList.toggle("hidden");
            if (previewCol.classList.contains("hidden")) {
                btnTogglePreview.textContent = "👁️ Exibir Prévia";
            } else {
                btnTogglePreview.textContent = "👁️ Ocultar Prévia";
            }
        });
    }

    // Sincronização do iFrame de Prévia com as Abas
    const liveIframe = document.getElementById("cms-live-iframe");
    const openLivePageBtn = document.getElementById("btn-open-live-page");
    const iframeWrapper = document.getElementById("iframe-wrapper");
    const deviceBtns = document.querySelectorAll(".admin-device-btn");

    const tabToPageMap = {
        "tab-home": "index.html",
        "tab-clinica": "nossa-clinica.html",
        "tab-servicos": "servicos.html",
        "tab-equipe": "equipe.html",
        "tab-contato": "contato.html"
    };

    // Alternador de Dispositivo (Desktop / Mobile)
    deviceBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const device = btn.getAttribute("data-device");
            deviceBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (device === "mobile") {
                if (iframeWrapper) {
                    iframeWrapper.classList.remove("desktop-view");
                    iframeWrapper.classList.add("mobile-view");
                }
            } else {
                if (iframeWrapper) {
                    iframeWrapper.classList.remove("mobile-view");
                    iframeWrapper.classList.add("desktop-view");
                }
            }
        });
    });

    // Troca de Abas
    const tabBtns = document.querySelectorAll(".admin-tab-btn");
    const tabContents = document.querySelectorAll(".admin-tab-content");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");
            
            tabBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            const activeContent = document.getElementById(targetTab);
            if (activeContent) activeContent.classList.add("active");

            // Atualiza a página exibida no iFrame de prévia
            const pageUrl = tabToPageMap[targetTab] || "index.html";
            if (liveIframe) liveIframe.src = pageUrl;
            if (openLivePageBtn) openLivePageBtn.href = pageUrl;

            // Limpa busca ao trocar de aba
            if (adminSearchInput && adminSearchInput.value) {
                adminSearchInput.value = "";
                filterFields("");
            }
        });
    });

    // Quando o iFrame carregar, envia os dados atuais para a prévia
    if (liveIframe) {
        liveIframe.addEventListener("load", () => {
            updateLivePreview();
        });
    }

    // Buscador Global em Tempo Real
    if (adminSearchInput) {
        adminSearchInput.addEventListener("input", (e) => {
            filterFields(e.target.value.toLowerCase().trim());
        });
    }

    function filterFields(query) {
        const activeTab = document.querySelector(".admin-tab-content.active");
        if (!activeTab) return;

        const boxes = activeTab.querySelectorAll(".admin-section-box, .admin-pilar-card, .admin-form-group");
        if (!query) {
            boxes.forEach(box => box.style.display = "");
            return;
        }

        boxes.forEach(box => {
            const text = box.textContent.toLowerCase();
            if (text.includes(query)) {
                box.style.display = "";
            } else {
                box.style.display = "none";
            }
        });
    }

    // Uploader de Fotos (Conversão para Base64 + Preview)
    const fileInputs = document.querySelectorAll(".admin-file-input");
    fileInputs.forEach(fileInput => {
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 4 * 1024 * 1024) {
                alert("A imagem selecionada é maior que 4MB. Por favor escolha uma imagem menor.");
                return;
            }

            const targetName = fileInput.getAttribute("data-target");
            const textInput = document.querySelector(`input[name="${targetName}"]`);

            const reader = new FileReader();
            reader.onload = function(event) {
                const base64Data = event.target.result;
                if (textInput) {
                    textInput.value = base64Data;
                    textInput.dispatchEvent(new Event("input", { bubbles: true }));
                }
                updateImgPreview(targetName, base64Data);
            };
            reader.readAsDataURL(file);
        });
    });

    // Caracteres e Prévia em Tempo Real nos Inputs
    if (cmsForm) {
        cmsForm.addEventListener("input", (e) => {
            markDirty();
            updateCharCounters();
            updateLivePreview();

            // Atualiza miniatura se for campo de imagem
            if (e.target.name && e.target.name.includes("img")) {
                updateImgPreview(e.target.name, e.target.value);
            }
        });

        cmsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const cmsData = getStoredData();

            const inputs = cmsForm.querySelectorAll("[data-path]");
            inputs.forEach(input => {
                const path = input.getAttribute("data-path");
                const val = input.value;
                setDeepValue(cmsData, path, val);
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(cmsData));
            clearDirty();
            showToast("Alterações publicadas com sucesso!");
        });
    }

    // Backup Exportar em JSON
    if (btnExportJson) {
        btnExportJson.addEventListener("click", () => {
            const data = getStoredData();
            const jsonStr = JSON.stringify(data, null, 2);
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

    // Backup Importar JSON
    if (inputImportJson) {
        inputImportJson.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const importedData = JSON.parse(event.target.result);
                    if (importedData && typeof importedData === "object") {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(importedData));
                        loadFormValues();
                        clearDirty();
                        showToast("Backup JSON importado com sucesso!");
                    } else {
                        alert("O arquivo JSON selecionado não é válido.");
                    }
                } catch(err) {
                    alert("Erro ao ler o arquivo JSON: " + err.message);
                }
            };
            reader.readAsText(file);
        });
    }

    // Restaurar Padrão
    if (btnResetDefault) {
        btnResetDefault.addEventListener("click", () => {
            if (confirm("Deseja mesmo restaurar todos os conteúdos para o padrão original da clínica?")) {
                localStorage.removeItem(STORAGE_KEY);
                loadFormValues();
                clearDirty();
                showToast("Conteúdos restaurados para os padrões de fábrica!");
            }
        });
    }

    // Auxiliares de Exibição
    function showLogin() {
        if (loginScreen) loginScreen.style.display = "flex";
        if (dashboardScreen) dashboardScreen.style.display = "none";
    }

    function showDashboard() {
        if (loginScreen) loginScreen.style.display = "none";
        if (dashboardScreen) dashboardScreen.style.display = "block";
        loadFormValues();
    }

    function markDirty() {
        isDirty = true;
        dirtyCount++;
        if (unsavedBadge) {
            unsavedBadge.style.display = "inline-flex";
            const span = unsavedBadge.querySelector("span");
            if (span) span.textContent = dirtyCount;
        }
    }

    function clearDirty() {
        isDirty = false;
        dirtyCount = 0;
        if (unsavedBadge) unsavedBadge.style.display = "none";
    }

    function updateCharCounters() {
        const groups = cmsForm.querySelectorAll(".admin-form-group");
        groups.forEach(group => {
            const input = group.querySelector("input[type='text'], textarea");
            const counter = group.querySelector(".char-counter");
            if (input && counter) {
                counter.textContent = `${input.value.length} caracteres`;
            }
        });
    }

    function updateImgPreview(fieldName, src) {
        const img = document.getElementById(`prev_${fieldName}`);
        if (img) {
            if (src) {
                img.src = src;
                img.parentElement.style.display = "block";
            } else {
                img.parentElement.style.display = "none";
            }
        }
    }

    // Transmite alterações em tempo real para a prévia do iFrame
    function updateLivePreview() {
        const liveIframe = document.getElementById("cms-live-iframe");
        if (!liveIframe || !liveIframe.contentWindow) return;

        const cmsData = getStoredData();

        // Incorpora valores digitados no formulário ainda não salvos
        const inputs = cmsForm.querySelectorAll("[data-path]");
        inputs.forEach(input => {
            const path = input.getAttribute("data-path");
            if (input.value !== undefined && input.value !== null) {
                setDeepValue(cmsData, path, input.value);
            }
        });

        try {
            liveIframe.contentWindow.postMessage({
                type: "NUCRE_CMS_PREVIEW",
                data: cmsData
            }, "*");
        } catch (e) {
            console.error("Erro ao enviar prévia para o iFrame:", e);
        }
    }

    // Carregar Valores nos Inputs
    function loadFormValues() {
        const cmsData = getStoredData();
        const inputs = cmsForm.querySelectorAll("[data-path]");
        inputs.forEach(input => {
            const path = input.getAttribute("data-path");
            const val = getDeepValue(cmsData, path);
            if (val !== undefined && val !== null) {
                input.value = val;
                if (input.name && input.name.includes("img")) {
                    updateImgPreview(input.name, val);
                }
            }
        });

        updateCharCounters();
        updateLivePreview();
    }

    // Dados do localStorage + Padrões
    function getStoredData() {
        const raw = localStorage.getItem(STORAGE_KEY);
        let custom = {};
        if (raw) {
            try { custom = JSON.parse(raw); } catch(e) {}
        }
        return deepMerge(getDefaultData(), custom);
    }

    function showToast(msg) {
        if (!adminToast) return;
        adminToast.textContent = msg;
        adminToast.classList.add("active");
        setTimeout(() => {
            adminToast.classList.remove("active");
        }, 3000);
    }

    function getDeepValue(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    function setDeepValue(obj, path, value) {
        const parts = path.split('.');
        let current = obj;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) current[parts[i]] = {};
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
    }

    function deepMerge(target, source) {
        for (const key of Object.keys(source)) {
            if (source[key] instanceof Object && key in target) {
                Object.assign(source[key], deepMerge(target[key], source[key]));
            }
        }
        Object.assign(target || {}, source);
        return target;
    }

    // Dados Padrões Iniciais do Site
    function getDefaultData() {
        return {
            home: {
                hero: {
                    title: "Clínica Nucre",
                    subtitle: "Referência em Fisioterapia Avançada e Cuidado Individualizado.",
                    text: "Há 16 anos, a Clinica consolida sua história como um centro de excelência em reabilitação física e promoção do bem-estar. Fundada sobre o pilar da fisioterapia baseada em evidências científicas, nossa missão é traduzir a vanguarda do conhecimento acadêmico em desfechos clínicos práticos, seguros e eficientes para cada paciente.",
                    img1: "assets/img/clinic-hero-1.jpg",
                    img2: "assets/img/clinic-hero-2.jpg",
                    img3: "assets/img/clinic-hero-3.jpg"
                },
                pilares: {
                    title: "Nossos Pilares Sólidos",
                    subtitle: "Valores e conceitos fundamentais que guiam nossa prática profissional e garantem sua recuperação.",
                    p1_title: "1) Ciência e Precisão Clínica.",
                    p1_text: "Não trabalhamos com protocolos genéricos. Nossa abordagem diagnóstica e terapêutica é rigorosamente pautada nas mais recentes diretrizes e estudos científicos internacionais. O raciocínio clínico refinado orienta cada etapa do tratamento, garantindo intervenções assertivas e de alta performance.",
                    p2_title: "2) A Soberania da Terapia Manual.",
                    p2_text: "Como nosso grande carro-chefe, a terapia manual é o núcleo dos nossos tratamentos. Unimos a sensibilidade do toque à precisão biomecânica. Através de técnicas de mobilização e manipulação articular, liberações miofasciais e modulação neurofisiológica, atuamos diretamente na causa das disfunções, restaurando a homeostase e a biomecânica natural do corpo.",
                    p3_title: "3) Conforto e Experiência do Paciente.",
                    p3_text: "Entendemos que o processo de reabilitação exige um ambiente propício. Nossa estrutura foi milimetricamente projetada para oferecer o máximo conforto, privacidade e acolhimento. Desde a ambientação acústica e térmica até o atendimento humanizado, cada detalhe visa transformar a sessão de fisioterapia em uma experiência de cuidado premium."
                },
                care: {
                    title: "Atendimento Domiciliar (Home Care)",
                    subtitle: "A excelência do tratamento Nucre no conforto do seu lar.",
                    text: "Para quem busca conveniência, possui limitações de mobilidade ou prefere a privacidade de sua casa, a Nucre oferece o serviço de fisioterapia domiciliar de alto padrão. Levamos toda a estrutura de avaliação e tratamento necessária até você.",
                    img: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800"
                },
                feedbacks: {
                    f1_name: "Mariana Souza",
                    f1_text: "Excelente atendimento! Consegui me recuperar de uma lesão grave no joelho em tempo recorde com a equipe da Nucre.",
                    f2_name: "Carlos Eduardo",
                    f2_text: "Fisioterapia baseada em ciência de verdade. O tratamento com osteopatia resolveu minhas dores crônicas na coluna.",
                    f3_name: "Fernanda Lima",
                    f3_text: "Estrutura impecável, equipe extremamente atenciosa e acompanhamento individualizado de altíssimo nível."
                },
                stats: {
                    s1_num: "16", s1_label: "Anos de História",
                    s2_num: "+10 mil", s2_label: "Pacientes Atendidos",
                    s3_num: "100%", s3_label: "Fisioterapia Baseada em Evidências",
                    s4_num: "5", s4_label: "Especialistas Dedicados"
                }
            },
            clinica: {
                hero: {
                    title: "Clínica Nucre",
                    subtitle: "Referência em Fisioterapia Avançada e Cuidado Individualizado.",
                    text: "Há 16 anos, a Clinica consolida sua história como um centro de excelência em reabilitação física e promoção do bem-estar. Fundada sobre o pilar da fisioterapia baseada em evidências científicas, nossa missão é traduzir a vanguarda do conhecimento acadêmico em desfechos clínicos práticos, seguros e eficientes para cada paciente.",
                    img: "assets/img/clinic-nossa-clinica.jpg"
                },
                stats: {
                    title: "Estrutura e Histórico",
                    subtitle: "Há 16 anos, integrando a ciência do movimento à arte de cuidar."
                }
            },
            services: {
                esp1: {
                    title: "Reabilitação de Lesões Esportivas",
                    desc: "Seja você um atleta profissional de alto rendimento ou um praticante de atividades físicas recreativas, nossa equipe está preparada para acelerar o seu retorno seguro ao esporte (return-to-play). Atuamos na fase aguda e crônica de lesões musculares, tendíneas e ligamentares, associando o manejo da dor ao restabelecimento da potência, flexibilidade e estabilidade articular.",
                    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
                },
                esp2: {
                    title: "Pós-Operatórios Complexos",
                    desc: "A reabilitação pós-cirúrgica (ortopédica e traumatológica) exige precisão cronológica para respeitar os tempos biológicos de cicatrização tecidual. Atendemos pacientes pós-artroscopias, reconstruções ligamentares (como LCA), artroplastias (próteses), cirurgias de coluna e diversos outros tipos de cirurgias; minimizando aderências cicatriciais, controlando o processo inflamatório e devolvendo a funcionalidade plena de forma gradual e segura.",
                    img: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=800"
                },
                esp3: {
                    title: "Longevidade e Qualidade de Vida",
                    desc: "A fisioterapia vai muito além do tratamento da dor aguda; ela é uma ferramenta de preservação funcional. Desenvolvemos programas focados na melhoria da mobilidade, alívio de tensões crônicas, correção de desequilíbrios biomecânicos e prevenção de lesões, permitindo que nossos pacientes desfrutem de uma rotina ativa, independente e com máxima vitalidade.",
                    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800"
                }
            },
            servicesDetails: {
                'fisioterapia-esportiva': {
                    title: 'Reabilitação de Lesões Esportivas',
                    description: 'Atuamos na fase aguda e crônica de lesões musculares, tendíneas e ligamentares, associando o manejo da dor ao restabelecimento da potência, flexibilidade e estabilidade articular.',
                    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
                    benefits: ['Retorno rápido ao esporte', 'Prevenção de recidivas', 'Ganho de potência', 'Estabilidade articular'],
                    faqs: [{ q: 'Em quanto tempo posso voltar a treinar?', a: 'Depende da gravidade da lesão, mas nosso protocolo acelera a liberação segura com testes de carga.' }]
                },
                'osteopatia': {
                    title: 'Osteopatia',
                    description: 'A Osteopatia é uma abordagem terapêutica global que foca no tratamento do corpo de forma integrada, com ênfase na manipulação musculoesquelética.',
                    image: 'assets/img/clinic-osteopatia.jpg',
                    benefits: ['Alívio de dores na coluna', 'Redução de enxaquecas', 'Melhora da mobilidade', 'Harmonia corporal'],
                    faqs: [{ q: 'Como é feito o tratamento?', a: 'Diagnóstico e manobras realizadas exclusivamente com as mãos do osteopata.' }]
                },
                'dry-needling': {
                    title: 'Dry Needling (Agulhamento a Seco)',
                    description: 'Técnica que utiliza agulhas ultrafinas para desativar pontos-gatilho e nós de tensão muscular de forma quase imediata.',
                    image: 'assets/img/clinic-dry-needling.png',
                    benefits: ['Alívio imediato da dor', 'Desativação de nós muscular', 'Ganho de flexibilidade', 'Melhora postural'],
                    faqs: [{ q: 'Dói?', a: 'A inserção da agulha é rápida e produz uma contração involuntária que traz alívio em seguida.' }]
                }
            },
            team: {
                header: {
                    title: "Os melhores especialistas ao seu lado",
                    desc: "Nossa equipe multidisciplinar é formada por alguns dos melhores fisioterapeutas de São Paulo, altamente capacitados e prontos para guiar sua recuperação de forma segura e humanizada."
                },
                elton: {
                    role: "Sócio / Fisioterapeuta - CREFITO-3/110812-F",
                    bio: "Sócio proprietário da Nucre, é graduado pela UNIFENAS e especialista em Fisioterapia Esportiva pelo CETE-UNIFESP. Osteopata pelo IDOT, possui certificação internacional no Método Mulligan e formações em Liberação Miofascial e Bandagens Funcionais. Atua como Coordenador do Projeto Escola de Atletas do Colégio Eduardo Gomes e do Tênis Competitivo no Clube Helvetia.",
                    img: "assets/img/people/elton.jpeg"
                },
                ricardo: {
                    role: "Sócio / Fisioterapeuta - CREFITO-3/115694-F",
                    bio: "Sócio proprietário da Nucre, é graduado pela UFSCar e especialista em Fisioterapia Esportiva pelo CETE-UNIFESP. Osteopata pelo IDOT, possui formações em Terapias Manuais (Maitland, Mulligan e Kabat) e Liberação Miofascial Instrumental. Acumulou experiência como Fisioterapeuta da Seleção Masculina de Vôlei de Ruanda e da equipe profissional de São Bernardo do Campo.",
                    img: "assets/img/people/ricardo.jpeg"
                },
                andre: {
                    role: "Fisioterapeuta - CREFITO-3/161567-F",
                    bio: "Graduado pela UFSCar e especialista em Fisioterapia Esportiva pelo CETE-UNIFESP. Fisioterapeuta da Clínica Nucre e do Projeto Escola de Atletas do Colégio Eduardo Gomes. É responsável pela prevenção de lesões do Tênis Competitivo do Clube Helvetia.",
                    img: "assets/img/people/people-3.jpeg"
                },
                fabio: {
                    role: "Fisioterapeuta - CREFITO-3/204486-F",
                    bio: "Graduado pela FMU, atua como fisioterapeuta da Clínica Nucre e do Projeto Escola de Atletas do Colégio Eduardo Gomes. Possui formação especializada em Terapias Manuais aplicadas à Ortopedia e Traumatologia.",
                    img: "assets/img/people/people-1.jpeg"
                },
                joice: {
                    role: "Fisioterapeuta - CREFITO-3/367622-F",
                    bio: "Graduada pelo Centro Universitário FMABC, possui aprimoramento em Fisioterapia Esportiva pelo CETE/UNIFESP e especialização em Traumatologia, Ortopedia e Esporte pela FMABC.",
                    img: "assets/img/people/people-2.jpeg"
                }
            },
            contact: {
                title: "Como podemos ajudar você hoje?",
                subtitle: "Agende sua avaliação, tire dúvidas sobre nossos tratamentos ou conheça nosso atendimento domiciliar. Estamos prontos para atender você.",
                whatsapp: "https://api.whatsapp.com/send?phone=5511973165620",
                address: "Av. Indianópolis, 3145 - sala 3 - Planalto Paulista, São Paulo - SP - CEP 04063-006",
                email: "contato@nucrefisioterapia.com.br",
                phone: "(11) 3333-4444"
            }
        };
    }
});
