import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AddressEntity } from './address.entity';

@Entity('countries')
export class CountryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    iso2Code: string;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => AddressEntity, address => address.country)
    addresses: AddressEntity[];
}
