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

export const generateSlugForTeamMembers = (name:string) => {
    return name
        .replace(/,/g, '') // Replace commas with hyphens
        .replace(/ /g, '-')
        .replace(/\./g, '')
        .toLowerCase(); // Optional: convert to lowercase
};