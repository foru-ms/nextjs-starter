import useForumsApi from '@/hooks/data/useForumsApi';
export default async function handler(req, res) {
    const { email, password, token } = req.body;
    const api = useForumsApi();
    try {
        const resetPasswordData = await api.resetPassword(email, password, token);
        return res.json(resetPasswordData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}