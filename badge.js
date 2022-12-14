async function nfcRead() {   
    try {
      	console.log("Initiating NFC reader");
        const ndef = new NDEFReader();
        await ndef.scan();
      	console.log("Listening...");
        
        ndef.addEventListener("readingerror", () => {
            console.log("NFC tag not supported. Try another one.");
        });

        ndef.addEventListener("reading", ({ message, serialNumber }) => {
	    console.log("Serial number is : " + serialNumber);
            var badgeId = parseInt(serialNumber.replaceAll(":",""), 16);
            
            var inputs = document.getElementsByTagName('input');
            for(var field of inputs) {
                switch(field.type) {
                    case 'text':
                        field.value=badgeId;
                        field.dispatchEvent(new Event('change', { 'bubbles': true }));
                        break;
                    case 'password':
                        field.value=badgeId;
                        field.dispatchEvent(new Event('change', { 'bubbles': true }));
                        break;
                    case 'checkbox':
                        break;
                    case 'submit':
			console.log("Submit connexion...");
                        field.click();
                        break;
                    default:
                        console.log('do nothing');
                } 
            }
        });
    } catch (error) {
        console.log("Issue : " + error);
        document.getElementById("authcontainer").addEventListener("click", async () => {
		try {
			const ndefb = new NDEFReader();
			await ndefb.scan();
			location.reload();
		} catch (error) {
			 //log("Argh! " + error);
		}
	});
    }
}

oktaSignIn.on('ready', function () {
  nfcRead();
});
