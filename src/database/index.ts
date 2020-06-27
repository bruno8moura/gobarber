import { createConnection } from 'typeorm';

/*
 * Varre a pasta do projeto a procura do arquivo 'ormconfig'. Dessa forma não é necessário passar as configurações de conexão aqui dentro do código.
 * Outra vantegem dessa abordagem é que a ferramenta cli do typeorm também está apto a ter acesso as mesma configurações no arquivo.
 */
createConnection();
