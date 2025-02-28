import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BankEntity } from './bank.entity';
import { AddressEntity } from './address.entity';

@Entity('swift_codes')
export class SwiftCodeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    swiftCode: string;

    @Column()
    isHeadquarter: boolean;

    @ManyToOne(() => BankEntity, bank => bank.swiftCodes)
    bank: BankEntity;

    @ManyToOne(() => AddressEntity, address => address.swiftCodes)
    address: AddressEntity;
}
