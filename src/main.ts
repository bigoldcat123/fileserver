#!/usr/bin/env node
import { log } from "console";
import { createReadStream, createWriteStream, openSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { createServer } from "http";
import path from "path";
import send from "send";

import locatIp from './ip'


async function main() {
    let _path = './'
    let port = 9999
    if(process.argv[2]) {
        _path = process.argv[2]
    }
    if(process.argv[3]) {
        try{
            port = parseInt(process.argv[3])
        }catch (e) {
            console.log('不合法的 端口号 ' + process.argv[3]);
        }
    }
    
    console.log('watching at : ' + path.resolve(_path));
    
    createServer((req, res) => {
        try{
            const decodeUrl = decodeURIComponent(req.url as string)
            if(decodeUrl.includes('/favicon.ico')){
                send(req, path.join(import.meta.dirname,'favicon.ico')).pipe(res)
                return
            }
            const dir = path.join(_path,decodeUrl);
            const files: string[] = []
            if(!statSync(dir).isDirectory()){
                send(req, dir).pipe(res)
                return;
            }
            const navigations:{
                url:string,
                name:string
            }[] = []
            const paths =  path.join(decodeUrl).split(path.sep)
            let url = ''
            paths.forEach(x => {
                if(!x) return
                url += '/' + x
                navigations.push({
                    url:url,
                    name:x
                })
            })
            
            readdirSync(dir).forEach(x => {
                files.push(x)
            })
            files.sort((a:string,b:string) => {
                if(statSync(path.join(dir,a)).isDirectory() && !statSync(path.join(dir,b)).isDirectory()){
                    return -1
                }
                if(statSync(path.join(dir,b)).isDirectory() && !statSync(path.join(dir,a)).isDirectory()){
                    return 1
                }
                return 0
            })
            
            res.setHeader('Content-Type', 'text/html;charset=utf-8')
            
            res.write(`
                <html>
                    <body>
                    <div>
                    <span><a href='/'>root/</a></span>${navigations.map(x => `<span><a href="${x.url}">${x.name}</a> </span>`).join('/')}</div>
                        <ul>
                            ${files.map(x => `<li><a ${statSync(path.join(dir,x)).isDirectory() ? '': `download="${x}"` }  href="${path.join(decodeUrl,x).replace(/\\/g,'/')}">${x}</a></li>`).join('')}
                        </ul>
                    </body>
                </html>
                `)
            res.end()
    
        } catch (e) {
            console.log(e);
            res.write('ggg')
            res.end()
        }
        
    }).listen(port, () => {
        console.log('listen' + 'http://' + locatIp + ':' + port);
    })
}

main()//---