const BASE_URL = window.location.origin;

// Fetches the online members
async function fetchDiscordWidget() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const discordBotOutput = document.getElementById('discord-bot-output');

    try {
        let data = { members: [] };

        if (data.members.length === 0) {
            discordBotOutput.style.display = 'none';
            loadingIndicator.style.display = 'block';
        }

        while (data.members.length === 0) {
            const response = await fetch(`${BASE_URL}/get_members`);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            
            data = await response.json();

            if (data.members.length === 0) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        displayData(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    } finally {
        loadingIndicator.style.display = 'none';
        discordBotOutput.style.display = 'block';
    }
}

// Displays the data for each online discord member
function displayData(data) {
    const activeCompany = document.querySelector('.company-button.company-button-active');
    const activeCompanyId = activeCompany ? activeCompany.id : null;
    const loadingIndicator = document.getElementById('loading-indicator');
    let members = data.members;

    const widgetDiv = document.getElementById('discord-bot-output');
    widgetDiv.innerHTML = ''; 

    if (activeCompanyId == 0) {
        const substrings = [
            "'Col.",
            "'LtCol.",
            "'Maj.",
            "'Major",
            ".Bvt.Cpt.",
            "*Cpt.",
            "Cpt.",
            ".1stLt.",
            ".2ndLt.",
            ".1stLtBvt.",
            ",Chaplain",
            ".BLT",
            "`Sgt."
        ];
        
        members = members.filter(member => {
            return member.name && substrings.some(substring => {
                if (substring === ".Bvt.Cpt.") {
                    return false;
                }
                else if (substring === ".1stLt." || substring === "Cpt.") {
                    return member.name.includes(substring) && (member.name.includes("69th") || member.name.includes("S1"));
                }
                else if (substring === "`Sgt.") {
                    return member.name.includes(substring) && member.name.includes("1stNY-B");
                }
                return member.name.includes(substring);
            });
        });
    }
    else if (activeCompanyId == 1) {
        members = members.filter(member => member.name && member.name.includes('69th-A'));
    }
    else if (activeCompanyId == 2) {
        members = members.filter(member => member.name && member.name.includes('69th-C'));
    }
    else if (activeCompanyId == 3) {
        members = members.filter(member => member.name && member.name.includes('69th-D'));
    }
    else if (activeCompanyId == 4) {
        members = members.filter(member => member.name && member.name.includes('69th-F'));
    }
    else if (activeCompanyId == 5) {
        members = members.filter(member => member.name && member.name.includes('69th-I'));
    }
    else if (activeCompanyId == 6) {
        members = members.filter(member => member.name && member.name.includes('69th-K'));
    }
    else if (activeCompanyId == 7) {
        members = members.filter(member => member.name && member.name.includes('1stNY-B'));
    }
    
    members.sort((a, b) => {
        const specialCharOrder = {
            "'": 1,
            "*": 2,
            ".": 3
        };
    
        const getOrder = (name) => {
            const firstChar = name.charAt(0);
            return specialCharOrder[firstChar] || 4;
        };
    
        const aOrder = getOrder(a.name);
        const bOrder = getOrder(b.name);
    
        if (aOrder !== bOrder) {
            return aOrder - bOrder;
        } else {
            return a.name.localeCompare(b.name);
        }
    });

    members.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.style.marginBottom = '15px';
        memberElement.style.display = 'flex'; 
        memberElement.style.alignItems = 'center'; 
        memberElement.style.flexDirection = 'row';
        memberElement.style.justifyContent = 'center';
        memberElement.classList.add('member');
    
        const avatarStatusContainer = document.createElement('div');
        avatarStatusContainer.style.position = 'relative';

        const avatarElement = document.createElement('img');
        avatarElement.src = member.avatar;
        avatarElement.alt = `${member.name}'s avatar`;
        avatarElement.style.width = '50px'; 
        avatarElement.style.height = '50px'; 
        avatarElement.style.borderRadius = '50%';
        avatarStatusContainer.appendChild(avatarElement);

        const statusElement = document.createElement('span');
        statusElement.style.display = 'inline-block';
        statusElement.style.width = '12px';
        statusElement.style.height = '12px';
        statusElement.style.borderRadius = '50%';
        statusElement.style.border = '2px solid black';
        statusElement.style.marginLeft = '-15%';

        switch (member.status) {
            case 'online':
                statusElement.style.backgroundColor = 'green';
                break;
            case 'idle':
                statusElement.style.backgroundColor = 'yellow';
                break;
            case 'dnd':
                statusElement.style.backgroundColor = 'red';
                break;
            default:
                statusElement.style.backgroundColor = 'gray';
        }

        avatarStatusContainer.appendChild(statusElement);
        memberElement.appendChild(avatarStatusContainer);       
    
        const nicknameElement = document.createElement('span');
        nicknameElement.textContent = ` ${member.name}`;
        nicknameElement.style.textShadow = '0 4px 4px rgba(0, 0, 0, 0.5)';
        nicknameElement.style.fontSize = 'font-size: clamp(12px, 0.7vw, 24px);';
        nicknameElement.style.color = '#E3E3E3';
        nicknameElement.style.marginLeft = '-2%';
        nicknameElement.style.maxWidth = "60%";
        memberElement.appendChild(nicknameElement);

        widgetDiv.appendChild(memberElement);
    });

    console.log(members);
}

// Calls the app.py to run discord-bot.py which fetches online members
async function runDiscordBot() {
    try {
        const response = await fetch(`${BASE_URL}/run_discord_bot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Success:', data);

        await fetchDiscordWidget();
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the discord bot when the structure page is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await runDiscordBot();
});

// If a company button is selected, make that one the active button
const buttons = document.querySelectorAll('.company-button');
buttons.forEach(button => {
    button.addEventListener('click', async () => {
        if (button.classList.contains('company-button-active')) {
            return; 
        }
        
        buttons.forEach(btn => btn.classList.remove('company-button-active'));
        button.classList.add('company-button-active');
        fetchDiscordWidget(); 
    });
});