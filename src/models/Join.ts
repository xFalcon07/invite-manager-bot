import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

import { Guild } from './Guild';
import { InviteCode } from './InviteCode';
import { Leave } from './Leave';
import { Member } from './Member';

export enum JoinInvalidatedReason {
	fake = 'fake',
	leave = 'leave'
}

@Entity({ engine: 'NDBCLUSTER PARTITION BY KEY (guildId)' })
@Index(['guild', 'member', 'createdAt'], { unique: true })
export class Join {
	@Column({ length: 32, primary: true, nullable: false })
	public guildId: string;

	@ManyToOne(type => Guild, g => g.joins, { primary: true, nullable: false })
	public guild: Guild;

	@PrimaryGeneratedColumn()
	public id: number;

	@CreateDateColumn()
	public createdAt: Date;

	@UpdateDateColumn()
	public updatedAt: Date;

	@Column({ length: 32, nullable: false })
	public memberId: string;

	@ManyToOne(type => Member, m => m.joins, { nullable: false })
	public member: Member;

	@ManyToOne(type => InviteCode, i => i.joins)
	public exactMatch: InviteCode;

	@Column({ nullable: true })
	public invalidatedReason: JoinInvalidatedReason;

	@Column({ default: false })
	public cleared: boolean;

	@OneToOne(type => Leave, l => l.join)
	public leave: Leave;
}
