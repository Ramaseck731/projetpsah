import { PrismaClient } from "@prisma/client";
import { verifyPassword, hashPassword } from "../utils/password.js";
import { createJWT } from "../utils/jwt.js";
const prisma = new PrismaClient();
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé", status: "KO" });
            }
            const isMatch = await verifyPassword(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Mot de passe incorrect", status: "KO" });
            }
            const token = createJWT({ id: user.id, role: user.role });
            res.status(200).json({ token, status: "OK", message: "Connexion réussi" });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de la connexion", error });
        }
    }
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "La déconnexion a échoué", status: "KO" });
            }
            res.json({ message: "La déconnexion a réussi", status: "OK" });
        });
    }
    async register(req, res) {
        try {
            const { email, fullName, password, role, phoneNumber } = req.body;
            const existingCompte = await prisma.user.findFirst({
                where: {
                    OR: [{ email }],
                },
            });
            if (existingCompte) {
                return res.status(409).json({ message: "Ce compte existe déjà", status: "KO" });
            }
            const hashedPassword = await hashPassword(password);
            const users = await prisma.user.create({
                data: {
                    email,
                    fullName,
                    role,
                    phoneNumber,
                    password: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            res.status(201).json({ message: "L'inscription a réussi", status: "OK" });
        }
        catch (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ message: "Erreur lors de l'inscription", status: "KO", error });
        }
    }
}
export default new AuthController();
