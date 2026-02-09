function sortStringsIgnoreSpaces(strings) {
    if (!Array.isArray(strings)) {
        throw new Error('Входные данные должны быть массивом строк');
    }
    
    return strings
        .map(str => String(str).replace(/\s+/g, '')) 
        .sort((a, b) => a.localeCompare(b));
}

function sortStringsIgnoreSpacesPreserveOriginal(strings) {
    if (!Array.isArray(strings)) {
        throw new Error('Входные данные должны быть массивом строк');
    }
    
    const cleaned = strings.map(str => ({
        original: str,
        cleaned: str.replace(/\s+/g, '')
    }));
    
    cleaned.sort((a, b) => a.cleaned.localeCompare(b.cleaned));
    
    return cleaned.map(item => item.original);
}

module.exports = {
    sortStringsIgnoreSpaces,
    sortStringsIgnoreSpacesPreserveOriginal
};