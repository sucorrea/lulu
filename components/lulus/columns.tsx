'use client';



export const useColumns = (isAuthenticated: boolean) => {
  const dadosAutenticados = [
    {
      accessorKey: 'aniversariantetipochavepix',
      header: 'Tipo Chave Pix',
      // cell: ({ row: { getValue } }) => {
      //   const tipoChave = getValue('aniversariantetipochavepix') as string;
      //   return (
      //     <p className={tipoChave === 'cpf' ? 'uppercase' : 'capitalize'}>
      //       {getValue('aniversariantetipochavepix')}
      //     </p>
      //   );
      // },
    },
    {
      accessorKey: 'aniversariantechavepix',
      header: 'Chave Pix',
      // cell: ({ row: { getValue } }) => {
      //   const tipoChave = getValue(
      //     'aniversariantetipochavepix'
      //   ) as TipoChavePix;
      //   const chave = getValue('aniversariantechavepix') as string;
      //   return formatterChavePix(tipoChave, chave);
      // },
    },
  ];

  const dados = isAuthenticated ? dadosAutenticados : [];

  const columns = [
    {
      accessorKey: 'aniversariantenome',
      header: 'Aniversariante',
      // cell: ({ row }) => <AvatarNome row={row} />,
    },
    {
      accessorKey: 'aniversarianteiconesigno',
      header: 'Signo',
      // cell: ({ row }) => {
      //   const data =
      //     new Date(row.original.aniversariantebirthdate) ?? new Date();

      //   return (
      //     <LinkIconWithText
      //       link={`${LINK_HOROSCOPO_DIARIO}${getSigno(data).value}/`}
      //       text={getSigno(data).label ?? ''}
      //     >
      //       <Icon icon={row.getValue('aniversarianteiconesigno')} />
      //     </LinkIconWithText>
      //   );
      // },
    },
    {
      accessorKey: 'aniversariantinstagram',
      // header: 'Instagram',
      // cell: ({ row: { getValue } }) => (
      //   <LinkIconWithText
      //     link={`${LINK_INSTAGRAM}${getValue('aniversariantinstagram')}`}
      //     text={`@${getValue('aniversariantinstagram')}`}
      //   >
      //     <Image src="/instagram.svg" alt="Instagram" width={20} height={20} />
      //   </LinkIconWithText>
      // ),
    },
    {
      accessorKey: 'aniversariantebirthdate',
      header: 'Aniversário',
      size: 100,
      minSize: 100,
      // cell: ({ row: { getValue } }) => {
      //   return formatterDate(getValue('aniversariantebirthdate') ?? '');
      // },
    },
    ...dados,
    {
      accessorKey: 'responsavelnome',
      // header: () => (
      //   <span className="flex flex-row-reverse items-center text-nowrap">
      //     Responsável Vaquinha
      //   </span>
      // ),
      // cell: ({ row }) => {
      //   const isParticipante = row.original.idresponsavel !== 29;
      //   return isParticipante ? <AvatarNome row={row} isResponsavel /> : null;
      // },
      size: 50,
      maxSize: 50,
    },
  ];

  return { columns };
};
