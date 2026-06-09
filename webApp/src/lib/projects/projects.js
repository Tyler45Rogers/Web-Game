    
    //Holds all the projects shown on the site
    export const projects = [
        {
            title: 'My Portfolio Site',
            description: 'A personal website built to show my projects.',
            details: 'You are on this site :). I built this site with SvelteKit and Tailwind CSS, I also made some games on the site as well for fun using Phaser.js.',
            screenshot: '/projectScreenshots/website.png'
        },
        {
            title: 'Discord Music Bot',
            description: 'A music bot for Discord with real-time playback.',
            details: 'This is a music bot built with Discord.py that takes in music from youtube, soundcloud, and spotify. It allows for playlists, looping, and general media control options.',
            screenshot: 'projectScreenshots/musicBot.png'
        },
        {
            title: 'Automatic Cat Feeder',
            description: 'An IoT device to feed your cat on schedule.',
            details: 'This project is an automatic cat feeder that dispenses food at scheduled times. The feeder is powered using a RPi Pico W with a Nema 17 stepper motor. For this project I also created and printed the enclosure for the feeder as well.',
            screenshot: 'projectScreenshots/chibiFeeder.png'
        },
        {
            title: 'VR Web Gallery (Capstone Project)',
            description: 'A virtual art gallery that can be accessed through VR. Built using SvelteKit, Tailwind CSS, Unity, WebXR, Docker, and Postgres.',
            details: 'This was a year long capstone project with 15 other students where we created an art gallery in VR. Along with the gallery we built a website where users can search through the different art pieces as well. My contribution to this project was implementing the admin page on our website to allow CRUD operations on our databse with the use of JSON Web Tokens for authentication.',
            screenshot: 'projectScreenshots/capstoneAdd.png'
        }
    ];