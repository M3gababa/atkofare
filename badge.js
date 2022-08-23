console.log("Start script");
console.log("Width : " + window.innerWidth);
console.log("Height " + window.innerHeight);

async function nfcRead() {
    try {
        console.log("NDEF Reader definition");
        const ndef = new NDEFReader();
        console.log("Wait scan...");
        await ndef.scan();
        console.log("Scan started...");

        ndef.addEventListener("readingerror", () => {
            console.log("NFC tag not supported. Try another one.");
        });

        ndef.addEventListener("reading", ({ message, serialNumber }) => {
            var badgeId = parseInt(serialNumber.replaceAll(":",""), 16);
            console.log("Serial Number: " + parseInt(serialNumber.replaceAll(":",""), 16));

            document.getElementById("idp-discovery-username").value = badgeId;
            document.getElementById("idp-discovery-username").dispatchEvent(new Event('change', { 'bubbles': true }));
            document.getElementById("idp-discovery-submit").click();
            var checkExist = setInterval(function() {
               if (document.getElementById("okta-signin-password")!=null) {
                  console.log("okta-signin-password exists!");
                  document.getElementById("okta-signin-password").value = badgeId;
                document.getElementById("okta-signin-password").dispatchEvent(new Event('change', { 'bubbles': true }));
                document.getElementById("okta-signin-submit").click();
                  clearInterval(checkExist);
               }
            }, 100);
        });
    } catch (error) {
        console.log("Argh! " + error);
    }
}
const nfcPermissionStatus = await navigator.permissions.query({ name: "nfc" });

if (nfcPermissionStatus.state === "granted") {
  nfcRead();
} else {
  document.querySelector("#scanButton").style.display = "block";
  document.querySelector("#scanButton").onclick = event => {
    nfcRead();
  };
}
