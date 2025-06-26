import { Router } from 'express';

import fs from 'fs';
import path from 'path';

import logger from '../../Infrastructure/logging/logger.js';

const router = Router();

router.get('/api/health', function(req, res) {
    let dependencies: Record<string, string> | undefined;
    try {
        // Intentar leer el package.json para obtener dependencias y versiones
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        dependencies = packageJson.dependencies;
    } catch (error) {
        dependencies = { 'error': 'No se pudieron obtener las dependencias' };
    }

    const healthInfo = {
        status: 'Ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || 'unknown',
        message: 'API running',
        dependencies: dependencies
    };

    logger.info(`Health Ejecutado: ${JSON.stringify(healthInfo)}`);
    res.status(200).json(healthInfo);
});

//muestra el readme en raiz
router.get('/', (req, res) => {
    const readmePath = path.join(process.cwd(), 'README.md');
    fs.readFile(readmePath, 'utf8', (err, data) => {
        // el error handler de express y de fs deberian de manejar cualquier excepcion surgida aca.
        if (err) {
            logger.error('No se pudo leer el README.md', err);
            return res.status(500).send('No se pudo cargar la documentación.');
        }
        // show as HTML
        res.type('text/markdown').send(data);
    });
});

export default router;