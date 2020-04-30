import Sequelize from "sequelize";

const defaultMaximumPoolSize: number = 10;

export const DatabaseConnection: Sequelize.Sequelize =
	new Sequelize.Sequelize(
		<string>process.env.DATABASE_URL,
		<Sequelize.Options>{
			dialect:  "postgres",
			protocol: "postgres",
			omitNull: true,
			freezeTableName: true,
			pool: <Sequelize.PoolOptions>{
				min: 0,
				acquire: 30000,
				max: defaultMaximumPoolSize
			}
		});

export const createTransaction = async (): Promise<Sequelize.Transaction> => {
	return DatabaseConnection.transaction();
};
