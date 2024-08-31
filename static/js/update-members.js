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
            const response = await fetch('http://localhost:5000/get_members');
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
        loadingIndicator.style.display = 'none'; // Ensure the loading indicator is hidden
        discordBotOutput.style.display = 'block';
    }
}

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
            "*Cpt.",
            ".1stLt.",
            ".2ndLt."
        ];
    
        members = members.filter(member => {
            return member.name && substrings.some(substring => member.name.includes(substring));
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
        memberElement.textContent = `ID: ${member.id}, Name: ${member.name}, Status: ${member.status}`;
        widgetDiv.appendChild(memberElement);
    });

    console.log(members);
}

async function runDiscordBot() {
    try {
        const response = await fetch('/run_discord_bot', {
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

        // Fetch the Discord widget data after the bot has run
        await fetchDiscordWidget();
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fetch the Discord widget data and run the Discord bot when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    await runDiscordBot();
});

// Add event listeners to the buttons
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