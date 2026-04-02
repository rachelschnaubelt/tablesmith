const snakeCaseString = (string) => {
    return string.toLowerCase().replaceAll(/[\/|\\|\<|\>|\:|\"|\||\?|\*\s+]/g, '-');
}

export {
    snakeCaseString
}
