
< tree >
./
├── prisma/          # database
├── scripts/         # scripts
├── src/             # code
└── .env             # config (create by yself)


< npm >
npm run dev         # dev
npm run build       # production
npm run db:push     # database
npm run lint        # quality code

< database >
echo 'DATABASE_URL="file:./dev.db"' > .env  # config file
npx prisma generate                         # gen prisma db

< credentials >
stage key : stagestream2025
user      : admin
pass      : 123456
