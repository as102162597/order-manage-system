import { MapperConfig } from "./mapper.config";

export class Mapper<DTO, DAO> {
    constructor(
        private readonly config: MapperConfig,
        private readonly Dto: { new (): DTO },
        private readonly Dao: { new (): DAO }
    ) {}

    getDao(dto: Partial<DTO>): DAO {
        if (!dto) {
            return null;
        }

        const dao = new this.Dao();
        this.mapFields(dao, dto);
        return dao;
    }

    getDto(dao: Partial<DAO>): DTO {
        if (!dao) {
            return null;
        }

        const dto = new this.Dto();
        this.mapFields(dto, dao);
        return dto;
    }

    private mapFields(target: DTO | DAO, source: Partial<DTO | DAO>): void {
        for (const key of this.config.getSharedFields()) {
            if (source[key]) {
                target[key] = source[key];
            }
        }
    }
};
