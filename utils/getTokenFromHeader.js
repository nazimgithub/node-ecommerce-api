export const getTokenFromHeader = (req) => {
    const token = req?.headers?.authorization?.split(" ")[1];
    if(token === undefined){
        return "No Token found in the header";
    }else{
        return token;
    }
}