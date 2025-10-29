import { configureStore } from "@reduxjs/toolkit";

import Authproject from './AuthStore/index'
import userPdfs from './userPdfs/index'
import questionPapers from './questionPapers/index'
export const store = configureStore({
    reducer: {
        Authproject,
        userPdfs,
        questionPapers,

    }
})