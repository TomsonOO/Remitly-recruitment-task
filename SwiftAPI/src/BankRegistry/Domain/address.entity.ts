import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CountryEntity } from './country.entity';
import { SwiftCodeEntity } from './swift-code.entity';

@Entity('addresses')
export class AddressEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    address: string;

    @Column()
    townName: string;

    @ManyToOne(() => CountryEntity, country => country.addresses)
    country: CountryEntity;

    @OneToMany(() => SwiftCodeEntity, swiftCode => swiftCode.address)
    swiftCodes: SwiftCodeEntity[];
}
