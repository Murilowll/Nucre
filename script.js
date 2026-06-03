document.addEventListener("DOMContentLoaded", () => {
    // Configurações do observador
    const observerOptions = {
        root: null, // Observa em relação à viewport do navegador
        rootMargin: '0px',
        threshold: 0.15 // Dispara quando 15% do elemento estiver visível na tela
    };

    // Criando o observador
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe 'active' que ativa o CSS translateY e opacity
                entry.target.classList.add('active');
                // Deixa de observar após animar (para animar apenas 1 vez)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleciona todos os elementos com a classe 'reveal' e aplica o observador
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Lógica para trocar o membro da equipe
    const thumbnails = document.querySelectorAll('.team-thumbnails img');
    const featuredImage = document.getElementById('featured-image');
    const featuredName = document.getElementById('featured-name');
    const featuredRole = document.getElementById('featured-role');
    const featuredBio = document.getElementById('featured-bio');
    const infoContainer = document.querySelector('.featured-team-info');

    if (thumbnails.length > 0 && featuredImage && featuredName && featuredRole) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const name = thumb.getAttribute('data-name');
                const role = thumb.getAttribute('data-role');
                const bio = thumb.getAttribute('data-bio');
                const image = thumb.getAttribute('data-image');

                // Atualiza a classe 'active' para a miniatura selecionada
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');

                // Adiciona as classes para a animação de esconder (fade-out)
                featuredImage.classList.add('fade-out-down');
                if (infoContainer) infoContainer.classList.add('fade-out-down');

                // Aguarda a transição CSS antes de trocar os textos e imagem
                setTimeout(() => {
                    featuredImage.src = image;
                    featuredImage.alt = name + " - Fisioterapeuta Nucre";
                    featuredName.textContent = name;
                    featuredRole.textContent = role;
                    if (featuredBio && bio) featuredBio.textContent = bio;

                    // Remove as classes para exibir novamente com transição (fade-in)
                    featuredImage.classList.remove('fade-out-down');
                    if (infoContainer) infoContainer.classList.remove('fade-out-down');
                }, 250);
            });
        });
    }

    // =========================================
    // Lógica Dinâmica para a Página de Serviços
    // =========================================
    const servicesData = {
        'fisioterapia-esportiva': {
            title: 'Fisioterapia Esportiva',
            description: 'Focada na prevenção de lesões e na recuperação acelerada de atletas amadores e profissionais. Utilizamos protocolos avançados para devolver você ao esporte com o máximo de performance e segurança.',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
            benefits: ['Retorno rápido ao esporte', 'Aumento de força e estabilidade articular', 'Correção de desequilíbrios musculares', 'Prevenção de recidivas e novas lesões'],
            faqs: [
                { q: 'Preciso ser atleta profissional?', a: 'Não! Atendemos desde atletas de fim de semana até profissionais de alto rendimento.' },
                { q: 'Qual a duração do tratamento?', a: 'O tempo varia de acordo com a lesão, mas nosso foco é sempre garantir uma alta segura no menor tempo possível.' }
            ]
        },
        'qualidade-de-vida': {
            title: 'Qualidade de vida',
            description: 'Programas de fisioterapia voltados para o bem-estar diário, alívio de dores crônicas e melhora da postura. Permite que você viva seus dias com muito mais disposição e sem limitações.',
            image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
            benefits: ['Alívio imediato de tensões diárias', 'Melhora significativa na qualidade do sono', 'Mais flexibilidade para tarefas do dia a dia', 'Redução do estresse corporal'],
            faqs: [
                { q: 'Como funciona a primeira avaliação?', a: 'Fazemos uma análise completa da sua postura, mobilidade e rotina para criar um plano sob medida para suas necessidades.' },
                { q: 'Pode ajudar com dores de trabalho (home office)?', a: 'Com certeza! Tratamos muito a ergonomia e as dores causadas por longos períodos na mesma posição.' }
            ]
        },
        'prevencao-de-lesoes': {
            title: 'Prevenção de lesões',
            description: 'Avaliação biomecânica completa e prescrição de exercícios específicos para corrigir desequilíbrios musculares antes que eles se transformem em lesões, garantindo a sua longevidade física.',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
            benefits: ['Mapeamento precoce de riscos', 'Economia de tempo e dinheiro com tratamentos futuros', 'Melhora da consciência corporal', 'Longevidade na prática esportiva'],
            faqs: [
                { q: 'Quando devo procurar esse serviço?', a: 'O momento ideal é antes de iniciar uma nova atividade física intensa ou caso perceba desconfortos leves constantes.' }
            ]
        },
        'reabilitacao-com-eletroterapia': {
            title: 'Reabilitação com eletroterapia',
            description: 'Uso de recursos eletrofísicos modernos como laser, ultrassom e correntes analgésicas para acelerar a cicatrização de tecidos, reduzir inflamações severas e promover alívio imediato da dor.',
            image: 'https://images.unsplash.com/photo-1588286840104-b44d137ba478?auto=format&fit=crop&q=80&w=800',
            benefits: ['Aceleração da cicatrização celular', 'Efeito analgésico rápido e eficiente', 'Redução expressiva de edemas (inchaços)', 'Abordagem totalmente não invasiva'],
            faqs: [
                { q: 'O tratamento com eletroterapia dói?', a: 'Não. Pelo contrário, os equipamentos são ajustados para proporcionar muito conforto e alívio durante a aplicação.' },
                { q: 'Existem contraindicações?', a: 'Gestantes e portadores de marcapasso passam por avaliações específicas, mas em geral é um tratamento muito seguro.' }
            ]
        },
        'reabilitacao-com-instrumentos': {
            title: 'Reabilitação com instrumentos',
            description: 'Aplicação de técnicas instrumentais modernas, como ventosaterapia, liberação miofascial instrumental e agulhamento a seco para soltar tensões profundas e melhorar a mobilidade articular.',
            image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
            benefits: ['Liberação miofascial muito mais profunda', 'Estímulo ao fluxo sanguíneo na região afetada', 'Quebra de pontos gatilho (nódulos de tensão)', 'Restauração rápida da mobilidade'],
            faqs: [
                { q: 'Ficam marcas na pele (como nas ventosas)?', a: 'Algumas técnicas podem deixar pequenas marcas temporárias e indolores, que tendem a sumir em poucos dias.' },
                { q: 'O agulhamento a seco (dry needling) é igual acupuntura?', a: 'Embora use agulhas semelhantes, o dry needling atua de forma direta no ponto de tensão muscular para liberação imediata, diferente da abordagem sistêmica da acupuntura.' }
            ]
        },
        'recovery': {
            title: 'Recovery',
            description: 'Sessões projetadas para acelerar a recuperação pós-treino ou pós-prova. Utilizamos botas de compressão pneumática, crioterapia e massagem desportiva para eliminar a fadiga rapidamente e relaxar a musculatura.',
            image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800',
            benefits: ['Remoção rápida do ácido lático', 'Alívio da sensação de pernas pesadas e exaustas', 'Prevenção de síndromes de overtraining', 'Relaxamento profundo do corpo e da mente'],
            faqs: [
                { q: 'Posso fazer a sessão logo após uma corrida?', a: 'Sim! É o momento ideal. Nossos equipamentos ajudam a reciclar as toxinas geradas pelo esforço rapidamente.' },
                { q: 'Precisa marcar com antecedência?', a: 'Recomendamos o agendamento prévio, principalmente em épocas de grandes provas ou maratonas em São Paulo.' }
            ]
        },
        'terapias-manuais': {
            title: 'Terapias manuais',
            description: 'Técnicas especializadas de mobilização e manipulação articular feitas com as mãos do fisioterapeuta. Foco em restaurar o movimento natural, diminuir a rigidez e tratar bloqueios de forma precisa.',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
            benefits: ['Alinhamento articular imediato', 'Diminuição significativa da rigidez de movimento', 'Melhora imediata da dor aguda', 'Abordagem precisa, segura e confortável'],
            faqs: [
                { q: 'É a mesma coisa que quiropraxia?', a: 'Utilizamos uma gama vasta de técnicas manuais (osteopatia, Maitland, Mulligan) que podem incluir manipulações dependendo da sua necessidade clínica.' }
            ]
        }
    };

    function loadServiceFromHash() {
        const hash = window.location.hash.replace('#', '');
        const listSection = document.getElementById('services-list');
        const detailSection = document.getElementById('service-detail');

        if (!listSection || !detailSection) return;

        if (hash && servicesData[hash]) {
            document.getElementById('detail-title').textContent = servicesData[hash].title;
            document.getElementById('detail-description').textContent = servicesData[hash].description;
            document.getElementById('detail-image').src = servicesData[hash].image;

            // Preencher Benefícios
            const benefitsList = document.getElementById('detail-benefits');
            benefitsList.innerHTML = '';
            servicesData[hash].benefits.forEach(benefit => {
                const li = document.createElement('li');
                li.textContent = benefit;
                benefitsList.appendChild(li);
            });

            // Preencher FAQs
            const faqsContainer = document.getElementById('detail-faqs');
            faqsContainer.innerHTML = '';
            servicesData[hash].faqs.forEach(faq => {
                faqsContainer.innerHTML += `
                    <div class="faq-item">
                        <div class="faq-question">
                            <span>${faq.q}</span>
                            <span class="faq-icon">+</span>
                        </div>
                        <div class="faq-answer">
                            <p>${faq.a}</p>
                        </div>
                    </div>
                `;
            });

            // Lógica do Acordeão para o FAQ gerado
            document.querySelectorAll('.faq-question').forEach(question => {
                question.addEventListener('click', () => {
                    const answer = question.nextElementSibling;
                    const icon = question.querySelector('.faq-icon');
                    
                    // Fechar todos
                    document.querySelectorAll('.faq-answer').forEach(a => a.style.maxHeight = null);
                    document.querySelectorAll('.faq-icon').forEach(i => {
                        i.textContent = '+';
                        i.style.transform = 'rotate(0deg)';
                    });

                    // Abrir o clicado, se estava fechado
                    if (!answer.style.maxHeight) {
                        answer.style.maxHeight = answer.scrollHeight + "px";
                        icon.textContent = '−';
                        icon.style.transform = 'rotate(180deg)';
                    }
                });
            });

            listSection.style.display = 'none';
            detailSection.style.display = 'block';
        } else {
            listSection.style.display = 'block';
            detailSection.style.display = 'none';
        }
    }

    window.addEventListener('hashchange', loadServiceFromHash);
    loadServiceFromHash();

    // =========================================
    // Lógica da Seção Panorama (Imagens largas com hover)
    // =========================================
    const panoramaWrapper = document.getElementById('panorama-wrapper');
    const panoramaImg = document.getElementById('panorama-img');

    if (panoramaWrapper && panoramaImg) {
        const centerImage = () => {
            const wrapperWidth = panoramaWrapper.offsetWidth;
            const wrapperHeight = panoramaWrapper.offsetHeight;
            const imgWidth = panoramaImg.offsetWidth;
            const imgHeight = panoramaImg.offsetHeight;
            
            let translateX = 0;
            let translateY = 0;

            if (imgWidth > wrapperWidth) translateX = (imgWidth - wrapperWidth) / 2;
            if (imgHeight > wrapperHeight) translateY = (imgHeight - wrapperHeight) / 2;

            panoramaImg.style.transition = 'transform 0.5s ease-out';
            panoramaImg.style.transform = `translate(-${translateX}px, -${translateY}px)`;
        };

        // Centraliza assim que a imagem for carregada
        if (panoramaImg.complete) { centerImage(); } 
        else { panoramaImg.addEventListener('load', centerImage); }

        panoramaWrapper.addEventListener('mousemove', (e) => {
            const wrapperWidth = panoramaWrapper.offsetWidth;
            const wrapperHeight = panoramaWrapper.offsetHeight;
            const imgWidth = panoramaImg.offsetWidth;
            const imgHeight = panoramaImg.offsetHeight;

            const wrapperRect = panoramaWrapper.getBoundingClientRect();
            const mouseX = e.clientX - wrapperRect.left;
            const mouseY = e.clientY - wrapperRect.top;
            
            let translateX = 0;
            let translateY = 0;

            if (imgWidth > wrapperWidth) translateX = (mouseX / wrapperWidth) * (imgWidth - wrapperWidth);
            if (imgHeight > wrapperHeight) translateY = (mouseY / wrapperHeight) * (imgHeight - wrapperHeight);

            // Movimento rápido e fluido acompanhando o mouse
            panoramaImg.style.transition = 'transform 0.1s ease-out';
            panoramaImg.style.transform = `translate(-${translateX}px, -${translateY}px)`;
        });
        
        // Centraliza novamente quando o mouse sai
        panoramaWrapper.addEventListener('mouseleave', centerImage);
        // Garante centralização ao redimensionar a tela
        window.addEventListener('resize', centerImage);
    }

    // =========================================
    // Lógica do Menu Mobile e Smart Header
    // =========================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.main-header');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                toggle.parentElement.classList.toggle('active');
            }
        });
    });

});