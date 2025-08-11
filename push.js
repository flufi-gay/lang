import { execSync } from 'child_process';

const message = process.argv[2] ?? "update (no name given :P)";

try {
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
    execSync('git push -u origin master', { stdio: 'inherit' });
} catch (error) {
    console.error('sad', error.message);
    process.exit(1);
}
