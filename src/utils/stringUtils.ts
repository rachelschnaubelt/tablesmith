const snakeCaseString = (string: string) => {
    return string.toLowerCase().replaceAll(/[\/|\\|\<|\>|\:|\"|\||\?|\*\s+]/g, '-');
}

export {
    snakeCaseString
}
