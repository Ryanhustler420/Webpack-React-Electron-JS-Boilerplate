class PostFixAlphabetsHelperClass {

    static getPostFixForIndex(index) {
        const letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.round(index % 26));
        const concat = Math.floor(index / 26);
        return concat > 0 ? this.getPostFixForIndex(concat - 1) + letter : letter + "";
    }

}

export default PostFixAlphabetsHelperClass;