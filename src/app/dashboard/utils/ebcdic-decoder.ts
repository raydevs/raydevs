import { IBM01145Charset } from "./IBM01145-charset";
import { map } from "./ascii-ebcdic.map";

export class EbcdicDecoder {

    static SUPPORTED_CHARSETS: string[] = ['ISO-8859-8', 'ascii', 'windows-1255', 'IBM855'];

    static NON_PRINTABLE_EBCDIC_HEX: string[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0A', '0B', '0C', '0D', '0E', '0F', '10',
        '11', '12', '13', '14', '15', '16', '17', '18', '19', '1A', '1B', '1C', '1D', '1E', '1F', '20', '21', '22', '23', '24', '25', '26', '27',
        '28', '29', '2A', '2B', '2C', '2D', '2E', '2F', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3A', '3B', '3C', '3D', '3E',
        '3F', '4F', 'FF'];

    static EBCDIC_HEX_REPLACEMENT: string = '70';

    private static bytesPerRow: number = 64;

    /**
     * https://stackoverflow.com/a/40031979
     * 
     * @param buffer 
     */
    static buf2Hex(buffer: ArrayBuffer): string {
        // create a byte array (Uint8Array) that we can use to read the array buffer
        let byteArray: Uint8Array | null = new Uint8Array(buffer);

        // for each element, we want to get its two-digit hexadecimal representation
        const hexParts = [];
        for (let i = 0; i < byteArray.length; i++) {
            // convert value to hexadecimal
            const hex = byteArray[i].toString(16); //Buffer.from(byteArray[i].toString()).toString('hex');
            // pad with zeros to length 2
            const paddedHex = ('00' + hex).slice(-2);
            // push to array
            hexParts.push(paddedHex.toUpperCase());
        }

        byteArray = null;
        // join all the hex values of the elements into a single string
        return hexParts.join(' ');
    }

    /**
     * Returns ascii calculated hexadecimal values from string
     * 
     * @param str The value to convert to hexadecimal values
     * @param delim The delimiter to separate hexadecimal values. Default space
     */
    static convertToHex(str: string, delim: string) {
        return str.split('').map(function (c) {
            return ('0' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(delim || '');
    };

    static toEBCDIC(hexData: string) {
        let ebcdic = '';
        if (hexData && hexData !== ' ') {
            ebcdic = hexData.toUpperCase().trim().split(' ').map(hexD => {
                return EbcdicDecoder.NON_PRINTABLE_EBCDIC_HEX.includes(hexD)
                    ? IBM01145Charset[EbcdicDecoder.EBCDIC_HEX_REPLACEMENT].ebcdic
                    : IBM01145Charset[hexD].ebcdic;
            }).join('')
        }
        return ebcdic;
    }

    /**
     * 
     * 
     * @param hexData 
     */
    static toASCII(hexData: string) {
        let ascii = '';
        if (hexData && hexData !== ' ') {
            let hexDataArr = hexData.trim().toUpperCase().split(' ');
            ascii = hexDataArr.map(codePoint => {
                let ascii = '�';
                if (EbcdicDecoder.NON_PRINTABLE_EBCDIC_HEX.includes(codePoint)) {
                    ascii = EbcdicDecoder.hex_to_ascii(codePoint);
                } else if (IBM01145Charset[codePoint]) {
                    ascii = IBM01145Charset[codePoint].ascii;
                }
                return ascii;
            }).join('');
        }
        return ascii;
    }

    static asciiHextoEbcdicHex(hexData: string): string {
        // TODO: review hex: D0 ebcdic: Ð
        let ebcdic = '';
        if (hexData && hexData !== ' ') {
            let ebcdicH = hexData.trim().toUpperCase().split(' ');
            ebcdic = ebcdicH.map(hexD => {
                let hex = map.get(hexD);
                if (hex) {
                    return hex.padEnd(2);
                } else {
                    console.log(`Ascii hexadecimal ${hexD} not found`)
                    return '� ';
                }
            }).join(' ');
        }
        return ebcdic + ' ';
    }

    /**
     * Used to calculate de ascii values of not printables chars
     * 
     * @param str1 
     */
    static hex_to_ascii(hex: string) {
        let str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        return str;
    }
}
