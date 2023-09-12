import { userDB } from "../../../dao/factory.js";
import {expect} from 'chai';

describe('Users dao test', function () {
    this.timeout(15000);

    it('Obtener usuario por email con getUserByEmail', async () => {
        let email = 'johndoe@mail.com'
        const result = await userDB.getUserByEmail(email);
        
        expect(result).to.be.ok;
        expect(result.email).to.be.eql('johndoe@mail.com')
    });

    it('Actualizar contraseña de usuario por email con updatePasswordByEmail', async () => {
        let email = 'johndoe@mail.com'
        let password = 'newpassword'
        const result = await userDB.updatePasswordByEmail(email,password);

        expect(result).to.be.ok;
        expect(result.password).to.be.eql('newpassword')
    });

    it('Cambiar rol del usuario con updateUserRole', async () => {
        let uid = '64fa1f1302d9331bf1dadf1b'
        let newRole = 'premium'
        const result = await userDB.updateUserRole({uid},newRole);

        expect(result).to.be.ok;
        expect(result.role).to.be.eql('premium')
    });
});