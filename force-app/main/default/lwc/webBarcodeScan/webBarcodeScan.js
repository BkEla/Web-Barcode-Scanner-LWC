import { LightningElement, track, api } from 'lwc';

export default class webBarcodeScan extends LightningElement {
    @track barcodeResult = '';

    @api
    get outputVariable() {
        return this.barcodeResult;
    }

    async startScanner() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            const video = this.template.querySelector('video');
            video.srcObject = stream;
            video.classList.remove('slds-hide');
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
            const barcodeDetector = new BarcodeDetector();
            const canvas = this.template.querySelector('.slds-hide');
            const context = canvas.getContext('2d');
    
            const scanBarcode = async () => {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const barcodes = await barcodeDetector.detect(canvas);
                if (barcodes.length > 0) {
                    this.barcodeResult = barcodes[0].rawValue;
                    this.stopScanner();
                    alert('Barcode scanned successfully!');
                } else {
                    requestAnimationFrame(scanBarcode);
                }
            };
    
            scanBarcode();
        } catch (err) {
            console.error(err);
        }
    }
    
    

    stopScanner() {
        const video = this.template.querySelector('video');
        const stream = video.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(track => track.stop());
        video.srcObject = null;
        video.classList.add('slds-hide');
    }

    handleScan() {
        this.startScanner();
    }
}
