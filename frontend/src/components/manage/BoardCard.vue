<template>
    <v-card>
        <template v-if="!edit">
            <v-card-title primary-title>
                <h3 class="headline mb-0">{{board.name}}</h3>
            </v-card-title>
            <v-divider light></v-divider>
            <v-card-text>
                <div>제목: {{board.title}}</div>
                <div>권한: {{board.level}}</div>
                <div>설명: {{board.rmk}}</div>
            </v-card-text>

            <v-divider light></v-divider>
            <v-card-actions>
                <v-btn flat color="orange" @click="modeChange(board)">수정</v-btn>
                <v-btn flat color="error" @click="ca=true">삭제</v-btn>
            </v-card-actions>
        </template>
        <template v-else>
            <v-card-title>
                <span class="headline">게시판 수정</span>
            </v-card-title>
            <v-card-text>
                <v-form>
                    <v-text-field
                        label="게시판 경로"
                        :hint="form.name ? '' : '경로로 사용하니 영어로 써주세요'"
                        persistent-hint
                        required
                        v-model="form.name"
                    ></v-text-field>

                    <v-text-field
                        label="게시판 제목"
                        :hint="form.title ? '' : '야구모임'"
                        persistent-hint
                        required
                        v-model="form.title"
                    ></v-text-field>

                    <v-text-field
                        label="게시판 설명"
                        :hint="form.rmk ? '' : '야구를 좋아하는 사람'"
                        persistent-hint
                        required
                        v-model="form.rmk"
                    ></v-text-field>

                    <v-select :items="lvs" label="권한" required v-model="form.level"></v-select>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat @click="modifyBoard(board)">확인</v-btn>
                <v-btn color="error darken-1" flat @click.native="edit = false">취소</v-btn>
            </v-card-actions>
        </template>

        <v-card-text v-if="ca">
            <v-alert v-model="ca" type="warning">
                <h4>정말 진행 하시겠습니까?</h4>
                <v-btn color="error" @click="deleteBoard(board)">확인</v-btn>
                <v-btn color="secondary" @click="ca=false">취소</v-btn>
            </v-alert>
        </v-card-text>
        <v-card-text v-if="ma.act">
            <v-alert v-model="ma.act" :type="ma.type" dismissible>{{ma.msg}}</v-alert>
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    props: ['board'],
    data() {
        return {
            ca: false,
            ma: {
                act: false,
                msg: '',
                type: 'error'
            },
            lvs: [0, 1, 2, 3],
            form: {
                name: '',
                level: 0,
                rmk: ''
            },
            edit: false
        };
    },
    methods: {
        modeChange(b) {
            this.edit = true;
            this.form = {
                title: b.title,
                name: b.name,
                level: b.level,
                rmk: b.rmk
            };
        },
        modifyBoard(board) {
            if (
                board.name === this.form.name &&
                board.rmk === this.form.rmk &&
                board.lv === this.form.level &&
                board.title === this.form.title
            ) {
                return this.$store.commit('pop', {
                    msg: '변경한 것이 없습니다.',
                    color: 'warning'
                });
            }

            this.$axios
                .put(`manage/board/${board._id}`, this.form)
                .then(r => {
                    if (!r.data.success) throw new Error(r.data.msg);
                    this.$store.commit('pop', {
                        msg: '게시판 수정 완료',
                        color: 'success'
                    });
                    board.name = this.form.name;
                    board.title = this.form.title;
                    board.rmk = this.form.rmk;
                    board.level = this.form.level;
                    this.edit = false;
                })
                .catch(e => {
                    if (!e.response)
                        this.$store.commit('pop', {
                            msg: e.message,
                            color: 'warning'
                        });
                });
        },
        deleteBoard(board) {
            this.$axios
                .delete(`manage/board/${board._id}`)
                .then(r => {
                    if (!r.data.success) throw new Error(r.data.msg);
                    this.$store.commit('pop', {
                        msg: '게시판 삭제 완료',
                        color: 'success'
                    });
                    this.$emit('list');
                })
                .catch(e => {
                    if (!e.response)
                        this.$store.commit('pop', {
                            msg: e.message,
                            color: 'warning'
                        });
                });
        }
    }
};
</script>