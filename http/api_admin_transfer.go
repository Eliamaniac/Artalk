package http

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/ArtalkJS/ArtalkGo/lib"
	"github.com/ArtalkJS/ArtalkGo/lib/artransfer"
	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func (a *action) AdminImportUpload(c echo.Context) error {
	// 获取 Form
	file, err := c.FormFile("file")
	if err != nil {
		logrus.Error(err)
		return RespError(c, "文件获取失败")
	}

	// 打开文件
	src, err := file.Open()
	if err != nil {
		logrus.Error(err)
		return RespError(c, "文件打开失败")
	}
	defer src.Close()

	// 读取文件
	buf, err := ioutil.ReadAll(src)
	if err != nil {
		logrus.Error(err)
		return RespError(c, "文件读取失败")
	}

	tmpFile, err := ioutil.TempFile("", "artalk-import-file-")
	if err != nil {
		logrus.Error(err)
		return RespError(c, "临时文件创建失败")
	}

	tmpFile.Write(buf)

	return RespData(c, Map{
		"filename": tmpFile.Name(),
	})
}

type ParamsAdminImport struct {
	Payload string `mapstructure:"payload"`
}

func (a *action) AdminImport(c echo.Context) error {
	var p ParamsAdminImport
	if isOK, resp := ParamsDecode(c, ParamsAdminImport{}, &p); !isOK {
		return resp
	}

	var payloadMap map[string]interface{}
	err := json.Unmarshal([]byte(p.Payload), &payloadMap)
	if err != nil {
		return RespError(c, "payload 解析错误", Map{
			"error": err,
		})
	}
	payload := []string{}
	for k, v := range payloadMap {
		payload = append(payload, k+":"+lib.ToString(v))
	}

	if !GetIsSuperAdmin(c) {
		user := GetUserByReq(c)
		allow := false
		for _, site := range user.ToCooked().SiteNames {
			if lib.ContainsStr(payload, "t_name:"+site) {
				allow = true
				break
			}
		}
		if !allow {
			return RespError(c, "禁止导入的目标站点名")
		}
	}

	c.Response().Header().Set(echo.HeaderContentType, echo.MIMETextHTMLCharsetUTF8)
	c.Response().WriteHeader(http.StatusOK)

	c.Response().Write([]byte(
		`<style>* { font-family: Menlo, Consolas, Monaco, monospace;word-wrap: break-word;white-space: pre-wrap;font-size: 13px; }</style>
		<script>function scroll() { if (!!document.body) { document.body.scrollTo(0, 999999999999); } }</script>`))
	c.Response().Flush()

	artransfer.Assumeyes = true
	artransfer.HttpOutput = func(continueRun bool, text string) {
		c.Response().Write([]byte(text))
		c.Response().Write([]byte("<script>scroll();</script>"))
		c.Response().Flush()
	}
	artransfer.RunImportArtrans(payload)

	return nil
}

func (a *action) AdminExport(c echo.Context) error {
	jsonStr, err := artransfer.ExportArtransString(func(db *gorm.DB) *gorm.DB {
		if !GetIsSuperAdmin(c) {
			// 仅导出限定范围内的站点
			db = db.Where("site_name IN (?)", GetUserByReq(c).ToCooked().SiteNames)
		}

		return db
	})
	if err != nil {
		RespError(c, "导出错误", Map{
			"err": err,
		})
	}

	return RespData(c, Map{
		"data": jsonStr,
	})
}
