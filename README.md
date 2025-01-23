# Irish Volunteer Brigade Website (2024)
This is a website that works on both PC and mobile to promote and hopefully have people join the Irish Volunteer Brigade regiment for the War of Rights video game. This website includes advertisements for this regiment, their leadership hierarchy, and shows who is online on their over 1,500 member discord.

[Irish Volunteer Brigade Website](https://theirishvolunteers.com/)

[Figma Design](https://www.figma.com/design/EYLFVkaJpGM6YWt8PB4sHB/IVB-Website-Redesign?node-id=0-1&t=AeaKEMQR97GxtOv1-1)

## Development Process

The creation of this website used HTML and CSS to create the main design of the website. In order to show who is currently online in this group's discord, I have created a Discord Bot that is in the server that will send information on every member to [discord-bot.py](https://github.com/nskarns/ivb-2024-website/blob/main/static/member-grabber/discord-bot.py). Once recieved, I use Python to filter out every person who is offline and create a new list of people who are online. From there, I used JavaScript to show generate the HTML that would allow the user on page to see who is currently online.

The process of seeing who is online within this group's Discord is ran on a server hosted on [Heroku](https://www.heroku.com/).

## Code Explanations

### [adjust-online-members-height.js](https://github.com/nskarns/ivb-2024-website/blob/main/static/js/adjust-online-members-height.js)
This determines the height of the company when it is selected on the 'Structure Page'. The height is set to a minimum, but if there are enough leadership to go past that minimum height, the height of the company list will increase.

### [gallery.js](https://github.com/nskarns/ivb-2024-website/blob/main/static/js/gallery.js)
This creates a pagination for the gallery so that only a few photos and videos show up on the screen at any given point. This also allows for users to click on photos to make them larger.

### [high-ranking.js](https://github.com/nskarns/ivb-2024-website/blob/main/static/js/high-ranking.js)
This updates the leadership shown for each company on the 'Structure Page' and its organization.

### [update-members.js](https://github.com/nskarns/ivb-2024-website/blob/main/static/js/update-members.js)
This shows who is currently online in the IVB within the selected company.

### [discord-bot.py](https://github.com/nskarns/ivb-2024-website/blob/main/static/member-grabber/discord-bot.py)
This looks through ever member on the Irish Volunteer Brigade discord and filters out the people who are offline on all ways that you can be on Discord. This is ran once you enter the 'Structure Page'.

### [grab-individual.py](https://github.com/nskarns/ivb-2024-website/blob/main/static/member-grabber/grab-individual.py)
This grabs individual discord members' information based on the list of people in [officer_ids.txt](https://github.com/nskarns/ivb-2024-website/blob/main/static/member-grabber/officer_ids.txt). Then it grabs the person's company and rank (both from [officer_ids.txt](https://github.com/nskarns/ivb-2024-website/blob/main/static/member-grabber/officer_ids.txt)) alongside their discord profile picture link and username (both from Discord's API). This file is ran periodically by myself to update officer information then pushed to the website. 
