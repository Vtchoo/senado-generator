import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('base_texts')
class BaseText {
    @PrimaryGeneratedColumn('increment') id: number
    @Column() text: string
}

export default BaseText
