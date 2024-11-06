export const generateSlugForMarineSection = (name:string) => {

    return name.replace(/&/g, '-')
    .replace(/,/g, '')                  
    .replace(/’/g, '-') 
    .replace(/'/g, '')                   
    .replace(/ +/g, '-')                 
    .replace(/-+/g, '-')                 
    .toLowerCase()                       
    .trim()
};