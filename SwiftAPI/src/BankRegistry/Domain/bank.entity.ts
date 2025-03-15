import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SwiftCodeEntity } from './swift-code.entity';

@Entity('banks')
export class BankEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => SwiftCodeEntity, (swiftCode) => swiftCode.bank)
  swiftCodes: SwiftCodeEntity[];
}
