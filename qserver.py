#!/usr/bin/env python
# coding: utf-8

# import os
import argparse
from bottle import Bottle
from bottle import request, static_file

app = Bottle()

ROOT_PATH = '.'

def prn_params(rqs):
    print("===============")
    print("query_string:")
    print(rqs.query_string)
    print("url_args:")
    for k, v in rqs.url_args.items():
        print(k + "  :  " + v)
    print("params:")
    for k, v in rqs.params.items():
        print(k + "  :  " + v)


def request_params(rqs):
    query = rqs.query_string
    if query.strip() == '':
        return {}
    pars = {}
    lst = query.split('&')
    for item in lst:
        kv = item.split('=')
        k = kv[0].strip()
        v = "" if len(kv) < 2 else kv[1]
        pars[k] = v
    return pars


def request_data(rqs):
    d = dict(rqs.headers.items())
    cl = d['Content-Length'].strip()
    le = int(cl)
    data = rqs.body.read(le)
    return data


@app.route('/', method='GET')
def hello():
    prn_params(request)
    pars = request_params(request)
    print("hello")
    print(request.url)
    print(pars)
    return static_file("index.html", root=ROOT_PATH)


@app.route('/<filepath:path>', nethod='GET')
def server_static(filepath):
    if 'favicon' in filepath:
        return
    prn_params(request)
    pars = request_params(request)
    print("server_static")
    print(request.url)
    print(pars)
    # n = os.path.basename(filepath)
    # lst = n.split('.')
    # ok = False
    # e = lst[-1:][0]
    # if len(lst) > 2:
    #     t = lst[-2:][0]
    #     ok = (e == 'csv' and t in ['form', 'token']) or (e == 'txt')
    # else:
    #     ok = (e == 'txt')
    # if ok:
    #     s = static_file(filepath, root="/u/ulax")
    # else:
    #     s = static_file(filepath, root=ROOT_PATH)

    s = static_file(filepath, root=ROOT_PATH)
    return s


# @app.route('/write/<filepath:path>', method='POST')
# def write(filepath=""):
#     data = request_data(request)
#     try:
#         # save_data(filepath,data)
#         fpath = os.path.join(ROOT_PATH, filepath)
#         fw = open(fpath, "wb")
#         fw.write(data)
#         fw.close()
#         os.chmod(fpath, 0o777)
#         # save_text_data_back(filepath)
#     except IOError as e:
#         msg = f"ERRORO write()"
#         raise Exception(f"{msg}\n{e}")
#     return "1"


@app.error(403)
def mistake403(code):
    return f'Error 403 There is a mistake in your url! '


@app.error(404)
def error404(error):
    return 'Erro 404 Nothing here, sorry'


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-i',
                        dest="ip",
                        required=False,
                        metavar="",
                        default="0.0.0.0",
                        help="-i <ip> (Default 0.0.0.0")
    parser.add_argument('-p',
                        dest="port",
                        required=False,
                        metavar="",
                        default="8080",
                        help="-p <port> (Default 80")
    parser.add_argument('-r',
                        dest="root",
                        required=False,
                        metavar="",
                        default=".",
                        help="-r <root> (Default . ")
    parser.add_argument('-d',
                        dest="debug",
                        required=False,
                        metavar="",
                        default="0",
                        help="-d 0/1 (Default 0 ")
    args = parser.parse_args()
    ip = args.ip
    port = int(args.port)
    ROOT_PATH = args.root
    print(f"{ip} {port} {ROOT_PATH}")
    if args.debug == '1':
        app.run(host=ip, port=port, quiet=False, reload=False)
    elif args.debug == '2':
        app.run(host=ip, port=port, debug=True, quiet=False, reload=False)
    else:
        print("Hit Ctrl-C to quit.")
        app.run(host=ip, port=port, debug=False, quiet=True)
else:
    print("application")
    application = app
