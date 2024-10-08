document.addEventListener('DOMContentLoaded', function() {
    const officerInfoUrl = '../member-grabber/officer_info.txt'; 

    const companyToSectionId = {
        'HQ': '0',
        'CoA': '1',
        'CoC': '2',
        'CoD': '3',
        'CoF': '4',
        'CoI': '5',
        'CoK': '6',
        'CoB': '7'
    };

    // Grabbing each individual officer's information
    async function fetchOfficerInfo() {
        try {
            const response = await fetch(officerInfoUrl);
            if (!response.ok) {
                console.error(`Failed to fetch ${officerInfoUrl}: ${response.statusText}`);
                return [];
            }
            const text = await response.text();
            const lines = text.trim().split('\n');
            const officerInfo = lines.map(line => {
                const parts = line.split(' ');
                const company = parts[0];
                const pos = parts[1];
                const avatarUrl = parts[2];
                const name = parts.slice(3).join(' ');
                return { company, pos, avatarUrl, name };
            });
            console.log('Officer info fetched and parsed successfully.');
            return officerInfo;
        } catch (error) {
            console.error(`Error fetching officer info: ${error}`);
            return [];
        }
    }

    // Display the officer and senior-ncos information in respective sections
function updateSections(officerInfo) {
    document.querySelectorAll('.officers, .senior-ncos').forEach(section => {
        section.innerHTML = '';
    });

    officerInfo.forEach(info => {
        const sectionId = companyToSectionId[info.company];
        console.log(`Processing ${info.name} for company ${info.company} with section ID ${sectionId}`);
        if (sectionId !== undefined) {
            const memberElement = document.createElement('div');
            memberElement.style.marginTop = '10px';
            memberElement.style.marginBottom = '10px';
            memberElement.style.display = 'flex'; 
            memberElement.style.alignItems = 'center'; 
            memberElement.style.flexDirection = 'row';
            memberElement.style.justifyContent = 'center';
            memberElement.style.textShadow = '7px 7px 7px rgba(0, 0, 0, 1)';
            memberElement.style.webkitTextStroke = '0.3px #000000';
            memberElement.classList.add('member');

            const avatarElement = document.createElement('img');
            avatarElement.src = info.avatarUrl == "NoAvatar" ? 'images/discord-logo.png': info.avatarUrl;
            avatarElement.alt = `${info.name}'s avatar`;
            avatarElement.style.width = '50px'; 
            avatarElement.style.height = '50px'; 
            avatarElement.style.borderRadius = '50%';
            memberElement.appendChild(avatarElement);       

            const nicknameElement = document.createElement('span');
            nicknameElement.textContent = ` ${info.name}`;
            nicknameElement.style.textShadow = '0 4px 4px rgba(0, 0, 0, 0.5)';
            nicknameElement.style.fontSize = 'font-size: clamp(12px, 1.2vw, 24px);';
            nicknameElement.style.color = '#E3E3E3';
            nicknameElement.style.marginLeft = '2%';
            nicknameElement.style.marginTop = '1%';
            nicknameElement.style.marginBottom = '1%';
            memberElement.appendChild(nicknameElement);

            if (info.pos === 'Officer') {
                const hqSection = document.querySelector(`.officers[data-section-id="${0}"]`);
                const officersSection = document.querySelector(`.officers[data-section-id="${sectionId}"]`);
                if (officersSection) {
                    officersSection.appendChild(memberElement);

                    if (info.company !== 'HQ') {
                        const memberElementClone = memberElement.cloneNode(true);
                        hqSection.appendChild(memberElementClone);
                    }

                    console.log(`Added officer ${info.name} to section ${sectionId}`);
                } else {
                    console.warn(`Officers section with ID ${sectionId} not found.`);
                }
            } else if (info.pos === 'NCO') {
                const ncosSection = document.querySelector(`.senior-ncos[data-section-id="${sectionId}"]`);
                if (ncosSection) {
                
                    ncosSection.appendChild(memberElement);
                    console.log(`Added NCO ${info.name} to section ${sectionId}`);
                } else {
                    console.warn(`NCOs section with ID ${sectionId} not found.`);
                }
            }
        } else {
            console.warn(`Company ${info.company} not found in mapping.`);
        }
    });
}

    // If the section doesn't have a certain group, then don't display it
    function toggleSections(activeId) {
        document.querySelectorAll('.officers, .senior-ncos').forEach(section => {
            if (section.getAttribute('data-section-id') === activeId) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    // When the active company button is changed, grab the id of that button
    document.querySelectorAll('.company-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.company-button').forEach(btn => btn.classList.remove('company-button-active'));
            this.classList.add('company-button-active');
            toggleSections(this.id);
        });
    });

    async function init() {
        const officerInfo = await fetchOfficerInfo();
        if (officerInfo.length > 0) {
            updateSections(officerInfo);
            const activeButton = document.querySelector('.company-button-active');
            if (activeButton) {
                toggleSections(activeButton.id);
            }
        } else {
            console.warn('No officer info available to update sections.');
        }
    }

    init();
});