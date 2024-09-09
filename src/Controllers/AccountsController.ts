import { Request, Response } from "express";
import { EthereumRepository } from "../Infrastructure/Repository/EthereumRepository";
import { DbRepository } from "../Infrastructure/Repository/DbRepository";
const _ethRepo = new EthereumRepository();
const _dbRepo = new DbRepository();

export const getAccountTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const accountId = req.params.accountId;
        const result = await _ethRepo.getUserTransactions(accountId);
        if (result.data) {
            res.status(200).json({
                data: result.data,
                count: result.count
            });
        } else if (result.error) {
            res.status(400).json({ error: result.error })
        } else {
            res.status(400).json({ is_successful: false });
        }
    } catch (error: any) {
        console.error("Error in getAccountTransactions:", error);
        res.status(400).json({ is_successful: false, error: error.message });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { address } = req.body;
        if (!address) {
            res.status(400).json({ is_successful: false, error: 'Address is required' });
            return;
        }

        // Ethereum address validation regex
        const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;

        if (!ethereumAddressRegex.test(address)) {
            res.status(400).json({ is_successful: false, error: 'Invalid Ethereum address format' });
            return;
        }

        await _dbRepo.createNewUser(address);
        res.status(201).json({ is_successful: true, message: 'User created successfully' });
    } catch (error: any) {
        res.status(500).json({ is_successful: false, error: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await _dbRepo.getAllUsers();
        res.status(200).json({ data: users });
    } catch (error: any) {
        res.status(500).json({ is_successful: false, error: error.message });
    }
};