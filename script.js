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
            description: 'A Fisioterapia Esportiva tem como principal objetivo reabilitar e prevenir lesões em atletas e praticantes de exercícios físicos. O foco de nossos profissionais está concentrado em proporcionar o retorno do indivíduo ao esporte o mais rápido possível. Por meio de análise do quadro de cada paciente, é possível elaborar uma técnica especializada e personalizada para cuidar e tratar cada caso. A fisioterapia esportiva prepara atletas especificamente para competições, previne lesões e dores em pessoas que praticam atividades físicas e recupera as contusões ocasionadas pelo esporte.',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
            benefits: [
                'Acelera o tempo de recuperação dos músculos, ligamentos, tendões e outras partes do corpo',
                'Reduz significativamente a dor e processos inflamatórios',
                'Garante que o corpo se recupere e cicatrize da maneira correta',
                'Previne futuras lesões físicas e otimiza a performance'
            ],
            faqs: [
                { q: 'Para quem é indicada?', a: 'Para atletas e praticantes de atividades físicas de todas as idades que desejam voltar a praticar esportes após uma lesão, ou pessoas que querem iniciar exercícios físicos com segurança.' },
                { q: 'Quais tipos de casos vocês tratam?', a: 'Atuamos em disfunções traumato-ortopédicas e reumatológicas, pós-operatórios, lesões musculares e ligamentares, hérnias, fraturas, entre outros.' }
            ]
        },
        'qualidade-de-vida': {
            title: 'Qualidade de Vida',
            description: 'Qualidade de vida e saúde andam juntas. Contamos com técnicas e modalidades que dão suporte e aptidão para as pessoas realizarem suas atividades diárias sem limitações. A Fisioterapia é uma ótima aliada para pessoas da terceira idade, melhorando a disposição para atividades físicas, locomoção e evitando a incidência de problemas ligados ao corpo e aos movimentos. Com nosso plano individual e personalizado, os idosos podem continuar exercendo suas atividades diárias e físicas sem interrupções.',
            image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
            benefits: [
                'Aumento expressivo da força muscular e óssea',
                'Melhora significativa da flexibilidade, equilíbrio e coordenação motora',
                'Prevenção do risco de quedas e de complicações respiratórias',
                'Melhoria do desempenho funcional, autonomia e bem-estar psicológico'
            ],
            faqs: [
                { q: 'Como é elaborado o plano de tratamento?', a: 'O plano envolve fortalecimento de músculos chave para atividades diárias, uso de terapias manuais para saúde articular, treinos de equilíbrio e analgesia de pontos dolorosos.' },
                { q: 'É indicado apenas para idosos?', a: 'Embora seja de extrema relevância para a terceira idade visando sua autonomia, é altamente indicado para qualquer pessoa que sinta limitações físicas em sua rotina.' }
            ]
        },
        'prevencao-de-lesoes': {
            title: 'Prevenção de Lesões',
            description: 'Qualquer tipo de lesão, além de causar um grande desconforto para o paciente, pode deixar a pessoa afastada de suas atividades diárias por semanas ou meses, impactando a saúde física e emocional. A prevenção é a melhor forma de manter-se ativo e saudável por muito mais tempo. O trabalho de prevenção de lesões do NUCRE se inicia por meio de uma avaliação terapêutica completa e com uma elaboração de exercícios específicos para as principais articulações e grupos musculares exigidos na sua rotina.',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800',
            benefits: [
                'Relaxa profundamente a musculatura e alivia pontos de tensão',
                'Aumenta a flexibilidade, a mobilidade e a disposição geral',
                'Melhora dores preexistentes nas articulações e músculos',
                'Auxilia no equilíbrio emocional e combate doenças como hipertensão e tendinites'
            ],
            faqs: [
                { q: 'Quem deve fazer prevenção de lesões?', a: 'É indicada para todas as pessoas, sejam praticantes de esportes que desejam melhorar seus movimentos ou idosos que buscam reduzir a incidência de quedas.' },
                { q: 'Como funciona o programa de exercícios?', a: 'Iniciamos com uma avaliação completa e prescrevemos exercícios específicos que visam corrigir desequilíbrios, fortalecer áreas de sobrecarga e relaxar a musculatura.' }
            ]
        },
        'reabilitacao-com-eletroterapia': {
            title: 'Reabilitação com Eletroterapia',
            description: 'A Eletroterapia atua principalmente no tratamento de dores musculares crônicas, atrofia muscular, recuperação de massa muscular e da função dos nervos, lombalgia, tendinite, fibrose e processos inflamatórios, além de reduzir o ácido lático em 25% através de estímulos elétricos. No NUCRE, utilizamos o Compex Wireless, um equipamento suíço de ponta sem fio que estimula diretamente o neurônio motor para acelerar o ganho de força e a cicatrização dos tecidos de forma extremamente eficiente.',
            image: 'https://images.unsplash.com/photo-1588286840104-b44d137ba478?auto=format&fit=crop&q=80&w=800',
            benefits: [
                'Fortalecimento muscular e ativação motora acelerada',
                'Redução rápida de dores agudas e crônicas',
                'Aceleração da regeneração celular e redução de inchaços',
                'Redução do acúmulo de ácido lático pós-esforço'
            ],
            faqs: [
                { q: 'Em quais casos a eletroterapia é indicada?', a: 'É indicada para pós-operatórios (especialmente de joelho para estimular o quadríceps), fraqueza muscular, fadiga crônica, luxações e traumas ósseos ou articulares.' },
                { q: 'Existem contraindicações?', a: 'Sim. É contraindicada para gestantes, portadores de marca-passo, próteses metálicas no local, trombose venosa, feridas abertas ou alterações de sensibilidade térmica.' }
            ]
        },
        'reabilitacao-com-instrumentos': {
            title: 'Reabilitação com Instrumentos',
            description: 'A reabilitação com instrumentos utiliza ferramentas especializadas para realizar tratamentos profundos e direcionados nos tecidos moles, acelerando o reparo tecidual, liberando aderências miofasciais e estimulando o fluxo sanguíneo local. Essa modalidade é essencial para reabilitar restrições de movimento e aliviar dores persistentes através de técnicas de fisioterapia instrumental avançadas.',
            image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
            benefits: [
                'Liberação miofascial profunda e restauração da fáscia muscular',
                'Aumento da circulação e oxigenação sanguínea no local lesionado',
                'Quebra de aderências teciduais e restauração rápida da mobilidade',
                'Combate e liberação de pontos gatilho profundos'
            ],
            faqs: [
                { q: 'Quais técnicas instrumentais são utilizadas?', a: 'O NUCRE conta com técnicas altamente consolidadas como Dry Needling (Agulhamento a seco), Miofibrólise Percutânea e Ventosaterapia.' },
                { q: 'Como essas técnicas auxiliam na reabilitação?', a: 'Elas agem diretamente sobre as fibras musculares e tecidos fasciais rígidos que limitam o movimento, promovendo um relaxamento imediato e acelerando a cura natural.' }
            ]
        },
        'recovery': {
            title: 'Recovery',
            description: 'As botas pneumáticas por compressão (Recovery) são um excelente recurso para ajudar atletas na recuperação de lesões ou reabilitação de cirurgias. Através de compressão sequencial por ar comprimido em pernas, braços e quadris, o tratamento estimula o fluxo de sangue, remove metabólitos e acelebra drasticamente o restabelecimento da performance esportiva de alto nível.',
            image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800',
            benefits: [
                'Estimulação profunda do retorno venoso e melhora da circulação',
                'Redução de edemas e inchaços provocados por microlesões de treinos',
                'Alívio imediato da fadiga, sensação de peso e dores musculares',
                'Prevenção e eliminação de cãibras musculares dolorosas'
            ],
            faqs: [
                { q: 'Quem deve realizar o Recovery?', a: 'Atletas profissionais ou amadores que possuem uma rotina árdua de treinos e competições, necessitando que o corpo se recupere rapidamente para a próxima sessão.' },
                { q: 'O que está incluso no atendimento de Recovery?', a: 'No NUCRE, disponibilizamos um kit exclusivo composto por botas pneumáticas de compressão sequencial, pistola massageadora vibratória e ventosas para liberação.' }
            ]
        },
        'terapias-manuais': {
            title: 'Terapias Manuais',
            description: 'As Terapias Manuais consistem em técnicas especializadas de mobilização e manipulação articular aplicadas diretamente pelas mãos do fisioterapeuta. O objetivo principal é atuar sobre as disfunções articulares e fasciais, restaurando a mecânica natural do corpo, diminuindo a rigidez articular e promovendo o alívio imediato das dores agudas.',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
            benefits: [
                'Alinhamento e posicionamento articular imediato',
                'Redução drástica da rigidez e restauração da amplitude de movimento',
                'Alívio e bloqueio de dores articulares agudas e crônicas',
                'Abordagem segura, precisa e sem dependência de medicamentos'
            ],
            faqs: [
                { q: 'Quais metodologias de terapia manual são aplicadas?', a: 'Nossos especialistas utilizam conceitos reconhecidos internacionalmente como Conceito Mulligan, Osteopatia clínica, Método Kabat e Método Maitland.' },
                { q: 'Terapia manual é dolorosa?', a: 'Não. Os movimentos e pressões são dosados individualmente respeitando o limiar de dor de cada paciente, visando sempre o conforto e a melhora imediata.' }
            ]
        },
        'osteopatia': {
            title: 'Osteopatia',
            description: 'A Osteopatia é uma abordagem terapêutica global que foca no tratamento do corpo de forma integrada, com ênfase especial na manipulação física do sistema musculoesquelético (músculos, ossos, articulações e ligamentos). O princípio fundamental da osteopatia é que a saúde de um indivíduo depende do alinhamento e do funcionamento harmônico de toda a sua estrutura corporal, permitindo que o organismo ative sua capacidade de autocura.',
            image: 'assets/img/clinic-osteopatia.jpg',
            benefits: [
                'Alívio significativo de dores na coluna (cervicalgia, lombalgia, hérnia de disco)',
                'Redução de dores de cabeça tensionais e enxaquecas',
                'Melhora da mobilidade das articulações e alívio de lesões esportivas',
                'Otimização do fluxo sanguíneo e melhora de distúrbios digestivos funcionais'
            ],
            faqs: [
                { q: 'Quais são os pilares e princípios da Osteopatia?', a: 'Ela baseia-se em quatro princípios: o corpo como uma unidade integrada; a capacidade inata de autocura (desde que livre de bloqueios); a estrutura corporal governando a função de nervos e órgãos; e a livre circulação do sangue e fluidos para nutrição dos tecidos.' },
                { q: 'Como é feito o tratamento?', a: 'O diagnóstico e o tratamento são feitos exclusivamente com as mãos. O osteopata utiliza manipulações articulares (para restaurar movimentos), técnicas musculares de alongamento, osteopatia craniana e osteopatia visceral (mobilizações suaves nos órgãos do abdômen).' }
            ]
        },
        'maitland': {
            title: 'Maitland',
            description: 'O Método Maitland (ou Conceito Maitland) é uma das abordagens mais respeitadas e utilizadas na fisioterapia manual ortopédica no mundo. Criado na década de 1960, o método foca na avaliação minuciosa e no tratamento de disfunções da coluna vertebral e das articulações periféricas (braços e pernas) através de movimentos passivos oscilatórios graduados, promovendo alívio da dor e ganho de amplitude de movimento.',
            image: 'assets/img/clinic-maitland.jpg',
            benefits: [
                'Alívio de dores agudas e crônicas na coluna vertebral e articulações',
                'Ganho rápido de amplitude de movimento e alongamento de ligamentos rígidos',
                'Tratamento eficaz para rigidez articular pós-imobilizações e pós-cirúrgicos',
                'Otimização do alinhamento mecânico das articulações'
            ],
            faqs: [
                { q: 'Como funcionam os graus de mobilização no Maitland?', a: 'As pressões manuais do terapeuta são divididas em 5 graus: Graus I e II (movimentos leves para alívio de dor e relaxamento), Graus III e IV (movimentos firmes no limite da articulação para ganhar mobilidade) e Grau V (manipulação rápida com estalo).' },
                { q: 'Quais são as contraindicações do método?', a: 'Contraindicações absolutas incluem fraturas recentes, instabilidade articular grave, tumores ósseos, infecções na articulação, compressão da medula espinhal e osteoporose avançada.' }
            ]
        },
        'mulligan': {
            title: 'Mulligan',
            description: 'O Método Mulligan baseia-se na premissa de que pequenas falhas no alinhamento de uma articulação (chamadas de falhas posicionais) após lesões ou desgastes podem causar dor crônica e limitação física. O método utiliza o conceito de Mobilização com Movimento (MWM): o fisioterapeuta aplica um deslizamento manual contínuo na articulação para corrigir esse microdesalinhamento enquanto o paciente realiza ativamente o movimento que antes era doloroso, eliminando a dor imediatamente.',
            image: 'assets/img/clinic-mulligan.jpg',
            benefits: [
                'Restauração imediata e indolor da amplitude natural de movimento',
                'Tratamento altamente eficaz para cervicalgias, lombalgias e torcicolos',
                'Redução de sobrecarga nos tendões (epicondilites e tendinopatias)',
                'Melhora rápida de limitações articulares pós-traumas e entorses'
            ],
            faqs: [
                { q: 'O que é a regra do "PILL" no Mulligan?', a: 'Significa que a aplicação da técnica deve ser livre de dor (Pain-free), ter efeito imediato (Instant result) e ser duradoura (Long-lasting). Se o paciente relatar qualquer dor durante o movimento, a força e a direção do deslizamento manual são ajustadas.' },
                { q: 'Quais são as principais contraindicações?', a: 'É contraindicado de forma absoluta em fraturas/luxações recentes, tumores ósseos, infecções ativas, osteoporose severa, instabilidade articular grave e sintomas de compressão da artéria vertebral.' }
            ]
        },
        'ventosaterapia': {
            title: 'Ventosaterapia',
            description: 'A Ventosaterapia é uma técnica milenar que utiliza copos (ventosas) sobre a pele para criar um vácuo. Esse vácuo gera uma força de sucção que puxa a pele e os tecidos musculares superficiais para dentro do copo. Embora seja muito associada à Medicina Tradicional Chinesa, a técnica também era usada no Antigo Egito e na Grécia Antiga. Hoje, ela é amplamente utilizada por fisioterapeutas, massoterapeutas e atletas para alívio de dores musculares e melhora da circulação.',
            image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=800',
            benefits: [
                'Aumento da circulação local: A sucção dilata os vasos sanguíneos, trazendo mais sangue oxigenado e nutrientes para a área tratada.',
                'Liberação miofascial: O vácuo ajuda a "descolar" e relaxar a fáscia (a capa de tecido conjuntivo que envolve os músculos), reduzindo a rigidez e a tensão.',
                'Estímulo do sistema linfático: Ajuda na drenagem de fluidos e na eliminação de toxinas retidas nos tecidos musculares.',
                'Melhora significativa da flexibilidade.'
            ],
            faqs: [
                { q: 'Por que ficam manchas roxas na pele?', a: 'A sucção rompe pequenos vasos sanguíneos superficiais (capilares), causando um leve extravasamento de sangue sob a pele (equimose). Na visão da medicina ocidental, isso estimula uma resposta inflamatória local controlada, ativando o sistema de cura do próprio corpo. Na medicina chinesa, a cor indica o nível de estagnação de energia (Qi) e sangue. Elas costumam sumir sozinhas entre 3 e 7 dias.' },
                { q: 'Quais são as principais indicações da ventosaterapia?', a: 'Dores nas costas (lombalgia, cervicalgia), tensão muscular e contraturas acumuladas por estresse ou treino pesado, recuperação muscular pós-exercício (recovery) e melhora na flexibilidade.' },
                { q: 'Quais são as contraindicações?', a: 'A técnica é segura, mas não deve ser aplicada em pessoas com distúrbios de coagulação ou anticoagulantes, regiões com feridas abertas, dermatites, queimaduras ou varizes expostas, mulheres grávidas (especialmente no abdômen e lombar), e pessoas com febre ou infecções agudas.' }
            ]
        },
        'miofibrolise-percutanea': {
            title: 'Miofibrólise Percutânea',
            description: 'A Miofibrólise Percutânea, popularmente conhecida como Crochetagem Mioaponeurótica ou Diafibrólise Percutânea, é uma técnica de terapia manual instrumentalizada. Desenvolvida na década de 1970 pelo fisioterapeuta sueco Kurt Ekman (colaborador do Dr. James Cyriax), ela surgiu da percepção de que os dedos humanos muitas vezes não alcançam a profundidade necessária ou não isolam com precisão as restrições entre as camadas de tecidos. Para isso, utilizam-se ganchos (crochets) de aço inoxidável ou poliamida com curvaturas e tamanhos variados.',
            image: 'https://images.unsplash.com/photo-1662991040523-9585a0653d9e?auto=format&fit=crop&q=80&w=800',
            benefits: [
                'Efeito Mecânico: Rompe fibras colágenas desorganizadas e cicatrizes que grudam um músculo no outro, devolvendo o deslizamento fisiológico entre as fáscias.',
                'Efeito Circulatório: Gera uma hiperemia profunda (aumento do fluxo sanguíneo local) e estimula a circulação linfática, acelerando a reabsorção de edemas.',
                'Efeito Reflexo: Inibe a hiperatividade muscular e promove analgesia (alívio da dor) atuando sobre mecanorrecetores e pontos-gatilho (trigger points).'
            ],
            faqs: [
                { q: 'Como a técnica funciona na prática?', a: 'O terapeuta realiza uma palpação precisa na pele para mapear as restrições de movimento e, em seguida, encaixa a curvatura do gancho nos septos intermusculares ou nas fáscias, realizando uma tração mecânica para quebrar aderências e restrições.' },
                { q: 'Quais são as principais indicações?', a: 'Aderências e fibroses pós-traumáticas ou pós-cirúrgicas, síndromes por pinçamento (túnel do carpo, ciatalgias), tendinopatias e fascite plantar, síndrome da dor miofascial (pontos-gatilho) e disfunções esportivas.' },
                { q: 'Quais são as contraindicações?', a: 'Não deve ser aplicada em casos de fragilidade cutânea (feridas, queimaduras), distúrbios de coagulação (uso de anticoagulantes, hemofilia, TVP), processos infecciosos ou inflamatórios agudos (febre, infecções locais), e tumores malignos ou suspeitas de câncer na região.' }
            ]
        },
        'ozonioterapia': {
            title: 'Ozonioterapia',
            description: 'A Ozonioterapia é uma abordagem terapêutica baseada na administração de uma mistura gasosa de oxigênio-ozônio (O2-O3), obtida através de um gerador de descarga de alta voltagem (efeito Corona) a partir de oxigênio medicinal puro. O ozônio (O3) atua como um indutor de estresse oxidativo controlado (eustresse). Ao entrar em contato com os fluidos biológicos, ele reage instantaneamente com ácidos graxos poli-insaturados (PUFAs) e compostos antioxidantes locais, ativando vias de sinalização celular fundamentais, modulando o sistema antioxidante endógeno (via Nrf2), atenuando cascatas inflamatórias e otimizando a liberação de oxigênio para os tecidos.',
            image: 'assets/img/clinic-ozonioterapia.png',
            benefits: [
                'Modulação do Nrf2: Induz a transcrição de enzimas antioxidantes endógenas (superóxido dismutase, catalase, glutationa peroxidase).',
                'Inibição do NF-κB: Atenua a cascata pró-inflamatória, reduzindo a liberação de citocinas inflamatórias (TNF-α, IL-1β e IL-6).',
                'Otimização Reológica e Metabólica: Aumenta a glicólise nos eritrócitos, facilitando a liberação de oxigênio (O2) para os tecidos isquêmicos e estimulando a vasodilatação.',
                'Ação analgésica e anti-inflamatória potente em patologias ortopédicas e síndromes de dor crônica.'
            ],
            faqs: [
                { q: 'Quais são as indicações clínicas baseadas em evidências?', a: 'Patologias ortopédicas e reumatológicas (discopatias, hérnia de disco lombar/cervical, osteoartrite de joelho, tendinopatias e síndromes miofasciais), isquemias periféricas crônicas, fibromialgia, dores neuropáticas e suporte adjuvante em doenças autoimunes.' },
                { q: 'Quais são as contraindicações absolutas?', a: 'Deficiência de Glicose-6-Fosfato Desidrogenase (G6PD / Favismo) pelo risco de hemólise aguda severa; inalação direta da mistura gasosa (altamente tóxica para o epitélio pulmonar); hipertiroidismo descompensado (toxicose); e gestação.' },
                { q: 'Quais são as contraindicações relativas?', a: 'Distúrbios de coagulação graves ou hemorragias ativas (pode interferir na agregação plaquetária), infarto agudo do miocárdio recente, AVC isquêmico agudo, intoxicação alcoólica aguda ou estados convulsivos.' }
            ]
        },
        'dry-needling': {
            title: 'Dry Needling',
            description: 'O Dry Needling (ou agulhamento a seco) é uma técnica que utiliza agulhas ultrafinas — idênticas às da acupuntura — para desativar pontos-gatilho (trigger points), que são aqueles nós rígidos e dolorosos que se formam nos músculos tensionados. Ao contrário da acupuntura tradicional, o dry needling se baseia puramente na anatomia humana e na neurofisiologia. A agulha penetra na pele até o músculo para quebrar esse ciclo de dor, gerando uma resposta de relaxamento muscular quase imediata.',
            image: 'assets/img/clinic-dry-needling.png',
            benefits: [
                'Desativação rápida de pontos-gatilho (trigger points) e nós de tensão muscular.',
                'Alívio imediato e duradouro de dores miofasciais e torcicolos.',
                'Redução expressiva de cefaleia tensional e dores irradiadas dos ombros/pescoço.',
                'Melhora significativa da flexibilidade e da amplitude articular.'
            ],
            faqs: [
                { q: 'Quais são as principais indicações do Dry Needling?', a: 'Dores miofasciais localizadas ou crônicas, torcicolos, tensões na cervical e lombar, cefaleia tensional, lesões esportivas (sobrecargas e tendinites) e síndrome da dor patelofemoral nos joelhos.' },
                { q: 'Quais são as contraindicações absolutas?', a: 'Recusa do paciente (medo extremo de agulhas/belonofobia), infecções ou feridas ativas no local a ser agulado, e áreas com comprometimento do sistema linfático (linfedema).' },
                { q: 'Quais são as contraindicações relativas que exigem cuidado ou adaptações?', a: 'Distúrbios de coagulação ou uso de anticoagulantes (risco de hematomas), gestantes (evitar áreas lombares, pélvicas e abdominais), sistema imunológico enfraquecido e aplicação próxima a próteses ou implantes cirúrgicos recentes.' }
            ]
        },
        'kabat': {
            title: 'Kabat',
            description: 'O Método Kabat, também conhecido como Facilitação Neuromuscular Proprioceptiva (FNP), é uma abordagem terapêutica que utiliza padrões de movimentos diagonais e espirais associados a estímulos sensoriais (táteis, visuais e verbais). O objetivo é facilitar e melhorar a resposta neuromuscular, promovendo o ganho de força, flexibilidade, coordenação e estabilidade articular. É amplamente indicado tanto na reabilitação neurológica quanto na ortopédica.',
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
            benefits: [
                'Melhora significativa da coordenação motora e do equilíbrio corporal',
                'Ganho rápido de força muscular através de facilitação proprioceptiva',
                'Estabilização articular dinâmica e melhora do controle postural',
                'Restauração de padrões funcionais de movimento no dia a dia'
            ],
            faqs: [
                { q: 'O que significa Facilitação Neuromuscular Proprioceptiva?', a: 'Proprioceptiva refere-se aos receptores sensoriais internos que informam o corpo sobre sua posição e movimento; Neuromuscular envolve a interação entre nervos e músculos; e Facilitação significa tornar o movimento mais fácil e coordenado.' },
                { q: 'Para quem o método Kabat é indicado?', a: 'É indicado para reabilitação pós-AVC, paralisias faciais, lesões medulares, esclerose múltipla, pós-operatórios ortopédicos, disfunções posturais e fraqueza muscular geral.' }
            ]
        },
        'liberacoes-miofasciais': {
            title: 'Liberações Miofasciais',
            description: 'A Liberação Miofascial é uma técnica manual altamente especializada que foca na fáscia muscular (o tecido conjuntivo que envolve e conecta todos os músculos e órgãos). Através de pressões manuais lentas e direcionadas, o terapeuta elimina restrições fasciais, desfaz aderências e desativa pontos-gatilho dolorosos. O resultado é o alívio imediato da tensão muscular, melhora da circulação local e restauração completa da amplitude de movimento.',
            image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=800',
            benefits: [
                'Alívio imediato de tensões musculares agudas e crônicas',
                'Restauração da flexibilidade e da elasticidade da fáscia',
                'Melhora do fluxo sanguíneo e oxigenação dos tecidos musculares',
                'Aceleração da recuperação muscular pós-treino (recovery)'
            ],
            faqs: [
                { q: 'O que é a fáscia muscular e por que ela fica rígida?', a: 'A fáscia é uma teia tridimensional contínua que envolve todas as estruturas do corpo. Sob estresse físico, má postura, sedentarismo ou lesões, ela perde hidratação, encurta e forma aderências rígidas, gerando dor e limitação de movimento.' },
                { q: 'A liberação miofascial causa dor?', a: 'Pode haver um desconforto suportável quando o fisioterapeuta atua sobre pontos de maior aderência ou nódulos de tensão. No entanto, a intensidade da técnica é dosada de acordo com o limite do paciente, resultando em uma profunda sensação de alívio e relaxamento logo após.' }
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
    // Lógica do Carrossel do Hero
    // =========================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-slider-dots .dot');
    let currentHeroSlide = 0;
    let heroSliderInterval;

    if (heroSlides.length > 0 && heroDots.length > 0) {
        function showHeroSlide(index) {
            heroSlides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            heroDots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            currentHeroSlide = index;
        }

        function nextHeroSlide() {
            let nextIndex = (currentHeroSlide + 1) % heroSlides.length;
            showHeroSlide(nextIndex);
        }

        function startHeroSlider() {
            clearInterval(heroSliderInterval);
            heroSliderInterval = setInterval(nextHeroSlide, 5000); // Muda a cada 5 segundos
        }

        // Evento de clique nos pontinhos (dots)
        heroDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-slide'));
                showHeroSlide(index);
                startHeroSlider(); // Reseta o timer ao interagir
            });
        });

        // Inicia o temporizador automático
        startHeroSlider();
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

    // =========================================
    // Botão Flutuante do WhatsApp com Múltiplas Regiões
    // =========================================
    const injectWhatsAppWidget = () => {
        const widgetHTML = `
            <div class="whatsapp-widget">
                <div class="whatsapp-popup" id="whatsapp-popup">
                    <div class="whatsapp-popup-header">
                        <div class="whatsapp-avatar">💬</div>
                        <div class="whatsapp-header-info">
                            <h4>Atendimento Nucre</h4>
                            <p>Online • Resposta rápida</p>
                        </div>
                        <button class="whatsapp-popup-close" id="whatsapp-close-btn">&times;</button>
                    </div>
                    <div class="whatsapp-popup-body">
                        <p>Olá! Escolha a unidade para iniciar o contato no WhatsApp:</p>
                        <div class="whatsapp-buttons">
                            <a href="https://api.whatsapp.com/send?phone=5511973165620&text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20a%20unidade%20de%20S%C3%A3o%20Paulo." target="_blank" class="whatsapp-btn-option">
                                <span class="btn-option-icon">🏢</span>
                                <div class="btn-option-text">
                                    <strong>São Paulo - Capital</strong>
                                    <span>Clínica no Planalto Paulista</span>
                                </div>
                            </a>
                            <a href="https://api.whatsapp.com/send?phone=5511973165620&text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20atendimento%20domiciliar%20em%20Itupeva%20e%20Indaiatuba." target="_blank" class="whatsapp-btn-option">
                                <span class="btn-option-icon">🏠</span>
                                <div class="btn-option-text">
                                    <strong>Itupeva e Indaiatuba</strong>
                                    <span>Fisioterapia Home Care (Domiciliar)</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <button class="whatsapp-trigger-btn" id="whatsapp-trigger-btn" aria-label="Fale conosco no WhatsApp">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                </button>
            </div>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = widgetHTML.trim();
        const widgetElement = div.firstChild;
        document.body.appendChild(widgetElement);
        
        const trigger = document.getElementById('whatsapp-trigger-btn');
        const popup = document.getElementById('whatsapp-popup');
        const closeBtn = document.getElementById('whatsapp-close-btn');
        
        trigger.addEventListener('click', () => {
            popup.classList.toggle('active');
        });
        
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!widgetElement.contains(e.target) && popup.classList.contains('active')) {
                popup.classList.remove('active');
            }
        });
    };
    
    injectWhatsAppWidget();

});