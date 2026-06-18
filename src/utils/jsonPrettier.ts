export function jsonPrettier(value: string): string {
    try{
        if(!value) return '';

        const jsonObj =JSON.parse(value)
        return JSON.stringify(jsonObj, null, 2)
    }catch(e){
        alert('Invalid JSON format file.')
    }
    // if(formatStr.split)
    return value
}