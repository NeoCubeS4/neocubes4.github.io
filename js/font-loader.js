document.addEventListener('DOMContentLoaded', function() {
    function checkFontLoaded() {
        console.log("Vérification du chargement de la police FFFLauta...");
        
        const fontTest = document.createElement('span');
        fontTest.innerText = 'Test';
        fontTest.style.fontFamily = 'FFFLauta, monospace';
        fontTest.style.position = 'absolute';
        fontTest.style.visibility = 'hidden';
        
        const fallbackTest = document.createElement('span');
        fallbackTest.innerText = 'Test';
        fallbackTest.style.fontFamily = 'monospace';
        fallbackTest.style.position = 'absolute';
        fallbackTest.style.visibility = 'hidden';
        
        document.body.appendChild(fontTest);
        document.body.appendChild(fallbackTest);
        
        const isFontLoaded = fontTest.offsetWidth !== fallbackTest.offsetWidth;
        
        document.body.removeChild(fontTest);
        document.body.removeChild(fallbackTest);
        
        if (isFontLoaded) {
            console.log("Police FFFLauta chargée avec succès!");
            document.body.classList.add('font-loaded');
        } else {
            console.log("Police FFFLauta non chargée, utilisation de la police de secours");
            document.body.classList.add('font-fallback');
            
            setTimeout(checkFontLoaded, 500);
        }
    }
    
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function() {
            console.log("Toutes les polices sont chargées");
            checkFontLoaded();
        });
    } else {
        setTimeout(checkFontLoaded, 500);
    }
    
    const scriptTag = document.createElement('script');
    scriptTag.src = './js/font-loader.js';
    scriptTag.defer = true;
    document.head.appendChild(scriptTag);
});
