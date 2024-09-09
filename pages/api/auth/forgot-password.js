import useForumsApi from '@/hooks/data/useForumsApi';
export default async function handler(req, res) {
    const { email } = req.body;
    const api = useForumsApi();
    try {
        const passwordData = await api.forgotPassword(email);
        return res.json(passwordData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}