export class Utils
{
    static getPixel (context, x, y)
    {
        return context.getImageData(x, y, 1, 1).data;
    }

    static isWhite (context, x, y)
    {
        let pixelData = Utils.getPixel(context, x, y);
        return pixelData[0] === 255 && pixelData[1] === 255 && pixelData[2] === 255;
    }

    static isBlack (context, x, y)
    {
        return !Utils.isWhite(context, x, y);
    }
}