const socket = io();
window.addEventListener('load', () => {
    console.log('loaded');
    socket.emit('init', token);
    socket.once('validated', () => {
        document.querySelector('#loadingbar').style.display = 'none';
        document.querySelector('#main').style.display = 'block';
        document.querySelector('#server').style.display = 'block';
        socket.emit('servers');
        socket.once('servers-resp', data => {
            document.querySelector('#server-lists').innerHTML = '';
            for (let x of data) {
                document.querySelector('#server-lists').innerHTML += `<div class="server-card" id="${x.id}"><img src="${x.icon}"><p>${x.name}</p></div>`;
            }
            for (let asdf of document.querySelectorAll('.server-card')) {
                asdf.addEventListener('click', () => {
                    window.gid = asdf.id;
                document.querySelector('#server').style.display = 'none';
                document.querySelector('#settings').style.display = 'block';
                document.querySelector('#selected-server').innerHTML = data.find(x => x.id == gid).name;
                socket.emit('getInfo', gid);
                socket.once('info', data2 => {
                    document.querySelector('#chid').value = data2.channelId || '';
                    document.querySelector('#chid').disabled = false;
                    document.querySelector('#msgid').value = data2.messageId || '';
                    document.querySelector('#msgid').disabled = false;
                    document.querySelector('#unverified').value = data2.unverifiedRole || '';
                    document.querySelector('#unverified').disabled = false;
                    document.querySelector('#verified').value = data2.verifiedRole || '';
                    document.querySelector('#verified').disabled = false;
                    document.querySelector('#txt').value = data2.msg || '{서버.이름} 규칙에 동의하신다면 아래 버튼을 눌러주세요.'
                    document.querySelector('#txt').disabled = false;
                    document.querySelector('#verified-msg').value = data2.verifiedMsg || '인증을 완료했어요!';
                    document.querySelector('#verified-msg').disabled = false;
                    document.querySelector('#done').addEventListener('click', () => {
                        socket.emit('subm', {
                            channelId: document.querySelector('#chid').value,
                            messageId: document.querySelector('#msgid').value,
                            unverifiedRole: document.querySelector('#unverified').value,
                            verifiedRole: document.querySelector('#verified').value,
                            msg: document.querySelector('#txt').value,
                            verifiedMsg: document.querySelector('#verified-msg').value,
                            guildId: gid
                        });
                        socket.once('submitted', msg => {
                            if (msg) {
                                alert(`Error: ${msg}`);
                            } else {
                                document.querySelector('#done').innerHTML = '완료!';
                                setTimeout(() => {
                                    document.querySelector('#done').innerHTML = '저장';
                                }, 3000);
                            }
                        });
                    });
                });
            });
        }
        });
    });
    socket.on('disconnected', () => {
        document.querySelector('#loadingbar').style.display = 'none';
        document.querySelector('#error').style.display = 'block';
    });
});