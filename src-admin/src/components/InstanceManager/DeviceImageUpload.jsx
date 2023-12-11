function DeviceImageUpload(params) {
    const {
        context, manufacturer, model, deviceId, onImageSelect, uploadImagesToInstance,
    } = params;

    const handleImageUpload = async event => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = async e => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = async () => {
                    const maxWidth = 50;
                    const maxHeight = 50;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    const resizedImage = canvas.toDataURL('image/webp');

                    // Build the file name from a manufacturer and model, if not available, use device id
                    const fileName = `${manufacturer ? `${manufacturer}_` : ''}${model || deviceId}`;
                    const base64Data = resizedImage.replace(/^data:image\/webp;base64,/, '');
                    const response = await context.socket.writeFile64(uploadImagesToInstance, fileName, base64Data);
                    console.log(`saveImage response: ${JSON.stringify(response)}`);

                    onImageSelect && onImageSelect(resizedImage);
                };
            };

            reader.readAsDataURL(file);
        }
    };

    /** @type {CSSProperties} */
    const imageUploadButtonStyle = {
        // make the button invisible but still clickable
        opacity: 0,
        position: 'absolute',
        width: '45px',
        height: '45px',
        zIndex: 3,
    };

    return <div>
        <input style={imageUploadButtonStyle} type="file" accept="image/*" onChange={handleImageUpload} />
    </div>;
}

export default DeviceImageUpload;
