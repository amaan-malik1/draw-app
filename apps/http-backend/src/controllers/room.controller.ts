export const roomController = (req: Request, res: Response) => {
    const { id, adminId, slug } = req.body;

    const userId = req.user._id;
    if (!id || !adminId || !slug) {
        return res.status(400).json({ message: 'Missing required fields' });
    }



}